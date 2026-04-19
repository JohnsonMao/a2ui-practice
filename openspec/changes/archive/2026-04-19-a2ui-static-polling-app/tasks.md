## 1. 測試框架設置

- [x] 1.1 安裝 Vitest 與 `@testing-library/react`、`jsdom`，在 `package.json` 新增 `"test": "vitest"` 腳本，並在 `vite.config.ts` 加入 `test: { environment: 'jsdom' }` 設定，確認空測試可通過

## 2. useJsonPolling Hook（TDD）

- [x] 2.1 [P] 寫失敗測試：驗證 `useJsonPolling` 首次 fetch 成功時會呼叫 `onNewData`（Poll local JSON file at fixed interval — first fetch scenario）
- [x] 2.2 [P] 寫失敗測試：驗證 fetch 回傳相同內容時 `onNewData` 不被呼叫（content unchanged scenario）
- [x] 2.3 [P] 寫失敗測試：驗證 fetch 失敗時 `error` 不為 null 且 polling 繼續（Report fetch errors without crashing）
- [x] 2.4 [P] 寫失敗測試：驗證 JSON parse 失敗時 `error` 不為 null 且 `onNewData` 不被呼叫（invalid JSON scenario）
- [x] 2.5 [P] 寫失敗測試：驗證 unmount 後 interval 被清除（Clean up interval on unmount）
- [x] 2.6 [P] 寫失敗測試：驗證成功更新後 `lastUpdated` 為 `Date` 實例（Expose last updated timestamp）
- [x] 2.7 實作 `src/hooks/useJsonPolling.ts`（Polling 機制使用 `useEffect` + `setInterval` + `fetch`；Polling Hook 抽取為 `useJsonPolling`），使上述所有測試通過。Hook 簽名：`useJsonPolling(url: string, onNewData: (data: unknown[]) => void, intervalMs?: number): { error: string | null; lastUpdated: Date | null }`

## 3. App 主架構（TDD）

- [x] 3.1 寫失敗測試：`MessageProcessor` 在 App render 後只建立一次（Initialize MessageProcessor with basicCatalog）
- [x] 3.2 寫失敗測試：`onSurfaceCreated` 事件觸發後，`<A2uiSurface>` 出現在 DOM（Subscribe to surface creation）
- [x] 3.3 寫失敗測試：未有 surface 時顯示 loading 佔位文字（No surface yet scenario）
- [x] 3.4 實作 `src/App.tsx`：以 `useState(() => new MessageProcessor([basicCatalog]))` 初始化 processor（`MessageProcessor` 以 `useState` 初始化一次）；以 `onSurfaceCreated` 訂閱並儲存 surface（Surface 訂閱採用 `onSurfaceCreated` + 單一 `main` surface）；以 `useJsonPolling('/ui.json', messages => processor.processMessages(messages))` 啟動 polling，呼叫 `processMessages` 以 Process A2UI protocol messages；surface 存在時渲染 `<A2uiSurface surface={surface} />`，否則渲染 loading 訊息

## 4. 範例 ui.json

- [x] 4.1 [P] 建立 `public/ui.json`（`public/ui.json` 作為範例與初始狀態），內容為一個 A2UI v0.9 message array，包含 `createSurface`（surfaceId: "main"）與至少一個 `upsertComponent`（Text 元件），確認手動 fetch 後 `MessageProcessor.processMessages` 不拋出例外（Provide example ui.json）
- [x] 4.2 [P] 更新 `README.md`，說明執行方式：`pnpm build` → `npx serve dist`，並說明 AI Agent 應寫入 `dist/ui.json` 的格式

## 5. 整合驗收

- [x] 5.1 執行 `pnpm build`，確認 `dist/` 產出正常且 `dist/ui.json` 存在
- [x] 5.2 以 `npx serve dist` 啟動，開啟瀏覽器確認 `public/ui.json` 的範例內容正確渲染到畫面上
- [x] 5.3 執行 `pnpm test`，確認所有測試通過
