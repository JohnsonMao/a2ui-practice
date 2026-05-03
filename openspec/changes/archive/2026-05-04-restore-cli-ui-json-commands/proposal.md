## Why

monorepo 重構（`2026-05-03-monorepo-restructure`）將 CLI 移至 `packages/cli`，但遺漏了 `read`、`set`、`update`、`open` 四個指令。這些指令是 agent-driven-ui workflow 的核心，`generate-ui-cli` spec 仍要求它們存在。

## What Changes

- 在 `packages/cli/src/commands/` 新增 `ui-json.ts`，實作 `read`、`set`、`update`、`open` 四個 Commander subcommand
- `read`：讀取 `ui.json` 並輸出至 stdout；檔案不存在時輸出 `[]`
- `set`：解析 JSON 引數並完整寫入 `ui.json`；JSON 格式錯誤時輸出至 stderr、non-zero exit、不修改檔案
- `update`：merge-by-ID；讀取現有陣列，對每個輸入 component 若 ID 存在則替換、否則 append；若 `ui.json` 缺少 `updateComponents` 訊息則輸出錯誤、non-zero exit
- `open`：`exec('open http://localhost:<port>')` 開啟瀏覽器，port 預設 5173
- 所有指令共用 `--ui-json <path>` 選項，預設 `__dirname/ui.json`（與 `serve` 一致）
- 在 `src/index.ts` 中 import 並 register 這四個指令
- 補充對應的 vitest 測試

## Non-Goals

- 不修改 `serve` 指令或 `generate-refs` 指令
- 不更動 `skills/generate-ui/scripts/` 目錄下的任何手寫檔案（cli.cjs 為 build 產物，由 `sync:scripts` 覆蓋）
- 不修改 `update` 指令的 merge 語意（保持 Method A：Agent 自帶父層）

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `a2ui-cli`：新增 `read`、`set`、`update`、`open` 四個指令的 requirements
- `generate-ui-cli`：`@a2ui/cli` 現在是 `cli.cjs` 的源頭，spec 中對這四個指令的描述需反映實作來源

## Impact

- Affected specs: `a2ui-cli`, `generate-ui-cli`
- Affected code:
  - `packages/cli/src/commands/ui-json.ts`（新增）
  - `packages/cli/src/index.ts`（register 新指令）
  - `packages/cli/src/commands/__tests__/ui-json.test.ts`（新增測試）
