## 1. 實作 cli.cjs — 單一檔案、零依賴 CLI

- [x] [P] 1.1 建立 `skills/generate-ui/scripts/cli.cjs` 並實作 serve 指令：整合 `serve.cjs` 的 HTTP 靜態伺服器邏輯（MIME 型別對應、SPA fallback、ui.json 路由），監聽 port 5173，啟動後輸出確認訊息；若 port 已被佔用，印出明確錯誤並提示使用 `cli.cjs open` — CLI provides serve command
- [x] [P] 1.2 在 `cli.cjs` 新增 open 指令：透過 `child_process.exec` 執行 `open http://localhost:5173` — CLI provides open command
- [x] [P] 1.3 在 `cli.cjs` 新增 read 指令：讀取與 `cli.cjs` 同目錄（`__dirname`）的 `ui.json` 並輸出至 stdout；若檔案不存在，輸出 `[]` — CLI provides read command
- [x] [P] 1.4 在 `cli.cjs` 新增 set 指令：解析 JSON 引數並寫入 `ui.json`，輸出確認訊息；若 JSON 格式錯誤，輸出錯誤至 stderr、以非零 exit code 結束、不修改 `ui.json` — CLI provides set command
- [x] 1.5 在 `cli.cjs` 新增 update 指令，實作 Method A merge-by-ID：解析 JSON 引數；讀取現有 `ui.json`；定位 `updateComponents` 訊息；對每個輸入 component，若 ID 已存在則整體替換，否則 append 至陣列末端；將結果寫回；若 `ui.json` 缺少 `updateComponents` 訊息，輸出錯誤、以非零 exit code 結束、不修改檔案 — CLI provides update command; update 語意：Method A（Agent 自帶父層）
- [x] 1.6 在 `cli.cjs` 新增頂層引數解析器，將 serve/open/read/set/update 子指令分發至各實作函式；若傳入未知指令或無指令，輸出使用說明 — CLI 實作方式：單一 cli.cjs，無外部依賴
- [x] 1.7 `serve` 指令在伺服器啟動後，透過 `child_process.exec` 自動執行 `open http://localhost:5173` 開啟瀏覽器 — CLI provides serve command

## 2. 更新 SKILL.md 工作流程

- [x] 2.1 更新 `skills/generate-ui/SKILL.md` 的 Workflow 章節：將步驟 2（async 模式執行 `node scripts/serve.cjs`）與步驟 3（`open_browser_page`）合併為一個步驟：async 模式執行 `node scripts/cli.cjs serve` — SKILL.md Workflow 更新
- [x] 2.2 在 SKILL.md 新增說明：後續 UI 更新應先執行 `node scripts/cli.cjs read` 確認現有結構，再以 `node scripts/cli.cjs update '[...]'` 只傳送有異動的 component — CLI provides update command; Provide example ui.json
- [x] 2.3 在 SKILL.md 記錄全部五個子指令（serve、open、read、set、update）的使用範例 — CLI provides serve command; CLI provides open command

## 3. 同步與驗證

- [x] 3.1 確認 `pnpm sync:skill` 將 `cli.cjs` 從 `skills/generate-ui/scripts/` 複製至 `.agents/skills/generate-ui/scripts/` — CLI is included in sync:skill
- [x] 3.2 在無 `node_modules` 的環境下執行 `node cli.cjs serve` ，確認伺服器正常啟動且無依賴錯誤 — CLI is zero-dependency
- [x] 3.3 執行 `pnpm sync:skill` 並確認 `.agents/skills/generate-ui/scripts/cli.cjs` 存在且內容正確

## 4. 改以 TypeScript 源碼 + Vite 打包

- [x] [P] 4.1 建立 `cli/index.ts`，將現有 `scripts/cli.cjs` 的全部邏輯移植為 TypeScript（保留所有指令：serve、open、read、set、update；`--ui-json` 測試旗標；路徑遍歷防護；禁用 any 型別）；測試檔放至 `cli/__tests__/cli.test.mjs` — CLI 實作方式：TypeScript 源碼 + Vite library mode 打包
- [x] [P] 4.2 在專案根目錄建立 `vite.cli.config.ts`：lib mode，entry 指向 `cli/index.ts`，fileName 固定為 `cli`，formats `['cjs']` ，outDir 為 `skills/generate-ui/scripts`，external 排除 `http`、`fs`、`path`、`child_process`，target `node18`，minify false — CLI 實作方式：TypeScript 源碼 + Vite library mode 打包
- [x] 4.3 更新 `package.json` 的 `build:skill` script：在 `vite build` 後、`cp -r dist/*` 前，加入 `vite build --config vite.cli.config.ts` 步驟；確認 cli.cjs 直接輸出至 `skills/generate-ui/scripts/` 而非走 cp 流程 — CLI 實作方式：TypeScript 源碼 + Vite library mode 打包
- [x] 4.4 將測試檔移至 `cli/__tests__/cli.test.mjs`（與 source 並列）；更新 CLI 路徑為 `../../skills/generate-ui/scripts/cli.cjs`；TMP_UI_JSON 放至 `cli/__tests__/` 自身；刪除 `skills/` 與 `.agents/skills/` 中的舊測試資料夾，避免測試檔被 sync:skill 同步至 agents
- [x] 4.5 執行 `pnpm build:skill` 驗證完整打包流程正確產出 `skills/generate-ui/scripts/cli.cjs`，再執行 `pnpm test -- cli/__tests__/cli.test.mjs` 確認 11 個測試全部通過 — CLI is zero-dependency
- [x] 4.6 執行 `pnpm sync:skill` 確認打包產出的 `cli.cjs` 已同步至 `.agents/skills/generate-ui/scripts/cli.cjs` — CLI is included in sync:skill
