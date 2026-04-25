## Why

generate-ui skill 目前要求 Agent 手動記住路徑、分三步驟啟動 server、並每次重寫完整的 `ui.json`；任何畫面調整都需重寫 50+ 行 JSON，錯誤率高且效率低。封裝 CLI 後，Agent 只需一行指令啟動環境，並透過增量 `update` 指令只傳送有變動的 component，大幅降低操作成本。

## What Changes

- 新增 `skills/generate-ui/src/cli.ts`：CLI 源碼改以 TypeScript 撰寫，提供型別安全與更易維護的開發體驗
- `scripts/cli.cjs` 改為打包產出物（不再手寫），由 Vite library mode 從 `src/cli.ts` 編譯而來
- 新增 `vite.cli.config.ts`：獨立的 Vite 設定，以 library mode 將 `src/cli.ts` 打包為 CJS 格式，並 inline 所有 Node.js 內建模組以維持 zero-dependency
- 更新 `pnpm build:skill`：加入 CLI 打包步驟（`vite build --config vite.cli.config.ts`），確保每次 build:skill 都產出最新 `cli.cjs`
- CLI 對外行為（五個子指令：`serve`、`open`、`read`、`set`、`update`）不變，Agent runtime 體驗與 SKILL.md 指引維持不變

## Non-Goals (optional)

- 不支援 `--parent` 自動 append 子節點：Agent 透過 `read` 取得現有結構後，自行在 `update` 中一併傳送父層異動
- CLI runtime 維持 zero-dependency：打包後的 `cli.cjs` 僅依賴 Node.js 內建模組，不 bundle 第三方 npm 套件
- 不取代 `serve.cjs`：`cli.cjs serve` 整合相同邏輯，`serve.cjs` 保留供向下相容
- 不將 CLI 開發依賴加入 `dependencies`（僅 devDependencies）

## Capabilities

### New Capabilities

- `generate-ui-cli`: 封裝 generate-ui skill 操作流程的 CLI 工具，提供 server 管理與 ui.json 讀寫指令

### Modified Capabilities

- `agent-driven-ui`: Workflow 步驟從「手動寫檔 + 啟動 serve.cjs + 開瀏覽器」改為「cli.cjs serve + cli.cjs update」，SKILL.md 操作指引隨之更新

## Impact

- 新增檔案：`skills/generate-ui/src/cli.ts`（TypeScript 源碼）
- 新增檔案：`vite.cli.config.ts`（CLI 打包設定）
- 產出檔案：`skills/generate-ui/scripts/cli.cjs`（打包產物，由 build:skill 產生）
- 修改檔案：`package.json`（`build:skill` script 加入 CLI build 步驟）
- 修改檔案：`skills/generate-ui/SKILL.md`（Workflow 章節，已完成）
- 同步影響：`pnpm sync:skill` 同步範圍包含 `cli.cjs`（打包產物）
- 不影響 App 本體（`src/`）或 `public/ui.json`
