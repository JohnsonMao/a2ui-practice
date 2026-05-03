## 1. 實作 ui-json 指令

- [x] [P] 1.1 建立 `packages/cli/src/commands/ui-json.ts`：實作 `addReadCommand(program)`，以 `--ui-json <path>` 選項（預設 `path.join(__dirname, 'ui.json')`）讀取檔案並輸出至 stdout；檔案不存在時輸出 `[]`，exit 0 — CLI provides read command, CLI ui-json path resolution, CLI provides read command for agent use
- [x] [P] 1.2 在同一檔案實作 `addSetCommand(program)`：接受 positional JSON 引數，解析後以 `fs.writeFileSync` 完整寫入 `ui.json`；JSON 格式錯誤時輸出錯誤至 stderr、non-zero exit、不修改檔案 — CLI provides set command, CLI provides set command for agent use
- [x] [P] 1.3 在同一檔案實作 `addUpdateCommand(program)`：讀取現有 `ui.json`，定位 `updateComponents` 訊息，對每個輸入 component 若 `id` 已存在則替換、否則 append；若缺少 `updateComponents` 訊息則輸出錯誤至 stderr、non-zero exit、不修改檔案 — CLI provides update command, CLI provides update command for agent use
- [x] [P] 1.4 在同一檔案實作 `addOpenCommand(program)`：接受 `--port <number>`（預設 5173），透過 `child_process.exec` 執行 `open http://localhost:<port>`；瀏覽器無法開啟時輸出 warning 至 stderr，exit 0 — CLI provides open command

## 2. 整合至 CLI 入口

- [x] 2.1 在 `packages/cli/src/index.ts` import `addReadCommand`、`addSetCommand`、`addUpdateCommand`、`addOpenCommand` 並 register 至 `program` — CLI provides read command, CLI provides set command, CLI provides update command, CLI provides open command

## 3. 測試

- [x] [P] 3.1 建立 `packages/cli/src/__tests__/ui-json.test.ts`：為 `read` 指令撰寫測試：(a) 檔案存在時輸出內容至 stdout；(b) 檔案不存在時輸出 `[]` — CLI provides read command
- [x] [P] 3.2 在同一測試檔為 `set` 指令撰寫測試：(a) 有效 JSON 正確寫入 `ui.json`；(b) 無效 JSON 不修改檔案、non-zero exit — CLI provides set command
- [x] [P] 3.3 在同一測試檔為 `update` 指令撰寫測試：(a) 既有 `id` 被替換；(b) 新 `id` 被 append；(c) 缺少 `updateComponents` 輸出錯誤、non-zero exit — CLI provides update command

## 4. 驗證

- [x] 4.1 執行 `nvm use 20.19.4 && pnpm --filter @a2ui/cli build` 確認打包成功產出 `packages/cli/dist/cli.cjs`
- [x] 4.2 執行 `nvm use 20.19.4 && pnpm --filter @a2ui/cli test` 確認所有測試通過
- [x] 4.3 執行 `pnpm sync:scripts` 確認 `skills/generate-ui/scripts/cli.cjs` 更新；以 `node skills/generate-ui/scripts/cli.cjs read` 手動驗證輸出正確
