## Context

本專案使用 Vite + React + TypeScript 打包成靜態檔案，搭配 `@a2ui/react` v0.9 協議渲染器，讓 AI Agent 只需寫入本地 `ui.json` 即可驅動 UI 更新。靜態檔案由 `npx serve dist` 提供服務，無需自建後端。

現有狀態：`src/App.tsx` 為空白起始點，`@a2ui/react` 與 `@a2ui/web_core` 已安裝於 `package.json`。

## Goals / Non-Goals

**Goals:**

- React App 啟動後自動開始 polling `ui.json`
- 偵測 JSON 內容變動時，透過 `MessageProcessor` 處理 A2UI messages，`A2uiSurface` 即時更新畫面
- 提供正確格式的範例 `public/ui.json` 供 AI Agent 參考

**Non-Goals:**

- 不實作雙向通訊（使用者輸入回傳 Agent）
- 不實作 file watcher / SSE / WebSocket
- 不自建 local server
- 不支援多個 surface 並存（只渲染 id 為 `main` 的 surface）

## Decisions

### Polling 機制使用 `useEffect` + `setInterval` + `fetch`

React app 在 mount 後啟動一個 `setInterval`（間隔 2000ms），每次呼叫 `fetch('/ui.json')` 取得最新內容。取得後將 response text 與上一次比對，若相同則跳過，若不同則解析 JSON 並呼叫 `MessageProcessor.processMessages()`。

**替代方案考慮：**
- File System Access API：需使用者每次授權，體驗差
- SSE/WebSocket：需要 server 端支援，違反「純靜態」目標

**JSON string 比對（非 deep equal）：** `JSON.stringify` 比對已足夠，因為 AI Agent 每次覆蓋整個檔案，內容相同即代表沒有新 messages。使用 response text 直接比對，避免重複 parse。

### `MessageProcessor` 以 `useState` 初始化一次

`MessageProcessor` 為有狀態物件，持有 surface 與 data model 的完整狀態。使用 `useState(() => new MessageProcessor([basicCatalog]))` 確保整個 App 生命週期只建立一個實例，避免狀態重置。

### Surface 訂閱採用 `onSurfaceCreated` + 單一 `main` surface

`MessageProcessor.onSurfaceCreated()` 回傳 subscription，需在 cleanup 時呼叫 `.unsubscribe()`。App 只追蹤第一個建立的 surface（或 id 為 `main` 的 surface），以 `useState<Surface | null>` 儲存並傳入 `<A2uiSurface>`。

### Polling Hook 抽取為 `useJsonPolling`

將 polling 邏輯封裝為自訂 Hook `useJsonPolling(url, onNewData, interval)`，回傳 `{ error, lastUpdated }`，讓 `App.tsx` 保持簡潔。

**Hook 介面：**
```typescript
function useJsonPolling(
  url: string,
  onNewData: (messages: unknown[]) => void,
  intervalMs?: number  // 預設 2000
): { error: string | null; lastUpdated: Date | null }
```

### `public/ui.json` 作為範例與初始狀態

放置於 `public/` 目錄，Vite build 後複製至 `dist/`，確保靜態伺服器可直接 serve。內容為一個完整的 A2UI v0.9 createSurface + upsertComponent 範例，讓 AI Agent 知道正確的訊息格式。

## Risks / Trade-offs

- **Polling 頻率 vs 效能**：2 秒間隔對大多數 AI Agent 輸出場景足夠，但若 JSON 檔案過大（> 1MB），每次讀取會有顯著延遲。→ 緩解：目前不設上限，若有需要可日後加入 Content-Length 檢查。
- **MessageProcessor 狀態累積**：`processMessages` 是累加式的，若 AI Agent 重寫整個檔案但包含重複 messages，可能導致重複渲染。→ 緩解：UI 層由 A2UI protocol 的 `upsertComponent` 語意保證冪等，重複處理相同 message 不會有副作用。
- **`file://` 協議 CORS**：若使用者直接雙擊 HTML 而非透過 local server，`fetch('/ui.json')` 會失敗。→ 緩解：README 明確說明需使用 `npx serve dist` 啟動，並在 UI 顯示錯誤提示。
