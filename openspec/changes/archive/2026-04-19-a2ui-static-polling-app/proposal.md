## Why

AI Agent 需要一個方式將生成的 UI 即時呈現給使用者，而不依賴後端伺服器或雲端部署。透過打包成靜態 HTML 搭配本地輕量伺服器，Agent 只需寫入 JSON 檔案即可驅動畫面更新。

## What Changes

- 新增 React App 主架構，整合 `@a2ui/react` 的 `MessageProcessor` 與 `A2uiSurface`
- 新增 JSON polling 機制：定期 fetch 本地 `ui.json`，比對內容變動後觸發 UI 更新
- 新增範例 `ui.json`（A2UI v0.9 protocol 格式），供 AI Agent 參考寫入格式
- Vite 打包設定確保產出可由靜態伺服器（如 `npx serve dist`）直接使用

## Non-Goals (optional)

- 不實作 WebSocket 或 SSE（AI Agent 單向寫入，polling 已足夠）
- 不實作 Server-Sent Events 的檔案監聽推送
- 不實作使用者輸入表單回傳 Agent（只做單向渲染）
- 不自建 local server，使用現有工具（`npx serve`、`npx http-server`）

## Capabilities

### New Capabilities

- `agent-driven-ui`: 透過 A2UI protocol 解析 AI Agent 產出的 JSON，渲染動態 UI 介面
- `local-json-polling`: 定期 fetch 本地 JSON 檔案，偵測內容變動後更新畫面

### Modified Capabilities

(none)

## Impact

- Affected specs: `agent-driven-ui`, `local-json-polling`
- Affected code:
  - `src/App.tsx` — 主應用程式，整合 polling 與 A2uiSurface 渲染
  - `src/hooks/useJsonPolling.ts` — polling 自訂 Hook
  - `public/ui.json` — 範例 A2UI protocol JSON（供 AI Agent 參考格式）
  - `vite.config.ts` — 確認打包設定無需調整
