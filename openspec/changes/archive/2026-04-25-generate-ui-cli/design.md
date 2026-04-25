## Context

generate-ui skill 目前的執行流程需要 Agent 執行三個獨立步驟：
1. 手動建構並寫入完整的 `ui.json`（含所有 component）
2. 執行 `node <絕對路徑>/scripts/serve.cjs`
3. 使用 `open_browser_page` 開啟 `http://localhost:5173`

任何後續 UI 修改都需要重寫整個 `ui.json`，即使只改一個 component 的屬性。這導致 Agent 容易出錯（路徑錯誤、JSON 結構錯誤），且浪費大量 token 在重複傳送未變動的 component。

`cli.cjs` 將上述流程封裝為單一 CLI 工具，存放於 `scripts/` 目錄中，與 `serve.cjs` 並列，並透過 `pnpm sync:skill` 同步至 `.agents/`。

## Goals / Non-Goals

**Goals:**

- 以單一指令完成 server 啟動 + 瀏覽器開啟（`serve`）
- 提供 `read` 讓 Agent 讀取現有 ui.json 結構
- 提供 `update` 實現增量 patch（依 ID merge，只更新有傳入的 component）
- 提供 `set` 維持整體替換選項
- 維持 zero-dependency（僅使用 Node.js 內建模組）

**Non-Goals:**

- 不支援 `--parent` 自動 append 子節點
- 不做 JSON schema 驗證（Agent 負責產生合法的 A2UI JSON）
- 不取代 `serve.cjs`（保留向下相容）
- 不提供 watch mode 或 hot reload（App 本身已每 2 秒 poll）

## Decisions

### update 語意：Method A（Agent 自帶父層）

**決定**：`update` 指令收到 component 陣列後，依 ID 在現有 `ui.json` 的 `updateComponents.components` 中逐一比對：
- ID 存在 → 整體替換該 component 物件
- ID 不存在 → append 至陣列末端

**放棄的替代方案 — Method B（`--parent` 自動 append）**：
CLI 接受 `--parent <id>` 參數，自動找到父 component 並將新 component append 進 `children`。

放棄原因：
1. `children`（陣列）與 `child`（字串）的雙重格式使 CLI 邊界情況複雜化
2. 插入位置語意模糊（最後？特定 index？）
3. Agent 透過 `read` 取得現有結構後，自行傳入父層並無額外負擔
4. Method A 保持 CLI 行為可預期、單純

**替代方案 — 完全不做 update（只做 set）**：放棄，因為這是本次改善的核心價值所在。

### CLI 實作方式：TypeScript 源碼 + Vite library mode 打包

**決定**：CLI 源碼改以 TypeScript 撰寫（`skills/generate-ui/src/cli.ts`），透過獨立的 `vite.cli.config.ts` 以 library mode 打包為 `skills/generate-ui/scripts/cli.cjs`。

**打包設定重點**：
- `target: 'node18'`：確保產出碼相容 Node.js 18+
- `format: 'cjs'`：產出 CommonJS 格式，讓 Agent 可直接 `node cli.cjs` 執行
- `external: ['http','fs','path','child_process']`：Node.js 內建模組不 bundle，維持 zero-dependency runtime
- `minify: false`：保留可讀性，便於 debug
- 使用 esbuild（Vite 內建）作為 transformer，無需額外安裝打包工具

**放棄的替代方案**：
- **直接用 tsc**：tsc 只做型別轉換，無法做 tree-shaking 或 banner injection；輸出不含 shebang 處理
- **esbuild CLI**：esbuild 並非 package.json devDependencies 直接依賴（是 Vite 的 transitive dep），直接呼叫不穩定
- **Rollup 獨立設定**：Vite 底層即 Rollup，直接用 Vite config 更一致

**對 `build:skill` 的影響**：
```
之前: vite build && cp -r dist/* skills/generate-ui/scripts/ && pnpm generate:refs
之後: vite build && vite build --config vite.cli.config.ts && cp -r dist/* skills/generate-ui/scripts/ && pnpm generate:refs
```
CLI build 步驟輸出直接寫入 `skills/generate-ui/scripts/cli.cjs`，不走 `cp` 流程。

**`--ui-json` 測試旗標**：測試用的路徑覆蓋機制保留在 TypeScript 源碼中，打包後仍可用。

### SKILL.md Workflow 更新

Workflow 從三步驟簡化：
- **之前**：寫 json → `node scripts/serve.cjs`（async）→ `open_browser_page`
- **之後**：`node scripts/cli.cjs serve`（async，整合啟動 + 開瀏覽器）→ 後續用 `cli.cjs update`

## Risks / Trade-offs

- **Port 衝突**：`serve` 指令若 5173 已被佔用，行為與現有 `serve.cjs` 相同（port in use 錯誤）。SKILL.md 指引 Agent 在此情況下跳過啟動步驟。
  → 緩解：`serve` 失敗時輸出明確錯誤訊息並提示使用 `cli.cjs open`
- **update 無法刪除 component**：Method A 只能替換或新增，無法移除 ID。
  → 緩解：需要移除 component 時，Agent 改用 `set` 傳入完整陣列
- **macOS 限定 `open` 指令**：`cli.cjs open` 目前僅在 macOS 可用。
  → 接受此限制，因為 skill 環境為 macOS
- **打包後 sourcemap**：若 `cli.cjs` 發生 runtime error，stack trace 指向打包後行號。
  → 緩解：`minify: false` + 選擇性開啟 sourcemap（開發時）
