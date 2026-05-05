## 1. figma-catalog-map 套件建立

- [x] [P] 1.1 在 `packages/figma-catalog-map` 建立套件骨架：`package.json`（ESM + CJS 雙輸出）、`tsconfig.json`、`src/index.ts`，確保 Component Map 以獨立 package 存放，由 Plugin 與 CLI 共用
- [x] [P] 1.2 實作 `catalogFigmaMap`：為所有 catalog 組件（Button、Text、Column、Row、Box、Card、Badge 等）填入 `figmaKey`、`figmaName`、`propMap`，並針對 Column/Row/Box 填入 `figmaType: 'auto-layout'` 及 `direction`，確保 figma-component-map package exports catalogFigmaMap
- [x] 1.3 實作未對應組件的警告工具函式 `warnUnmapped(componentName)`，輸出 stderr 訊息並回傳 `undefined`，確保 Unknown Figma components produce warnings, not errors
- [x] 1.4 撰寫單元測試，驗證 Button/Column 的 mapping 正確性及未知組件的 warning 行為，確保 figma-component-map package is importable in both Node.js and browser environments

## 2. CLI — serve 新增 POST /ui.json 端點

- [x] [P] 2.1 在 `packages/cli/src/commands/serve.ts` 加入 `POST /ui.json` 路由：解析 JSON body、驗證格式（陣列），寫入 `ui.json`；無效 JSON 回傳 HTTP 400，依照設計決策「`serve` 新增 POST /ui.json 而非另開一個 port」
- [x] [P] 2.2 更新 `serve.ts` 的 `Content-Type` 與 `Access-Control-Allow-Origin` 標頭，確保 Figma Plugin iframe 的跨來源請求不被 CORS 擋住
- [x] 2.3 為 POST endpoint 新增整合測試，確保 CLI provides a2ui serve command（MODIFIED）

## 3. CLI — a2ui pull-figma 命令

- [x] 4.1 建立 `packages/cli/src/commands/pull-figma.ts`，實作 `a2ui pull-figma <figma-url>`，從 URL 解析 fileKey 與 nodeId，確保 CLI provides a2ui pull-figma command
- [x] 4.2 實作 Figma REST API 呼叫（`GET /v1/files/:fileKey/nodes?ids=:nodeId`），讀取 `FIGMA_TOKEN` 環境變數；無 token 時輸出錯誤訊息並以非零 exit code 退出
- [x] 4.3 實作 Figma node tree → A2UI JSON 的轉換邏輯，呼叫 `figma-catalog-map` 的 `catalogFigmaMap` 進行映射，未對應組件呼叫 `warnUnmapped`
- [x] 4.4 在 `packages/cli/src/index.ts` 註冊 `pull-figma` 命令，並撰寫測試（mock Figma API 回應）

## 5. Figma Plugin 建立

- [x] 5.1 在 `packages/figma-plugin` 建立套件骨架：`manifest.json`（manifest v2）、Vite 設定、plugin sandbox 入口（`src/code.ts`）與 UI 入口（`src/ui/App.tsx`），確保 Figma Plugin 使用 manifest v2，UI 以 React + Vite 建構
- [x] 5.2 實作 Plugin UI：包含 port 設定輸入框、「Push to Preview」與「Pull from Preview」按鈕，透過 `parent.postMessage` 與 sandbox 通訊
- [x] 5.3 實作 plugin sandbox 的 Push to Preview 邏輯：走訪選取節點樹，使用 `figma-catalog-map` 映射組件，透過 UI iframe 的 `fetch` POST 到 `http://localhost:<port>/ui.json`，確保 Figma Plugin provides Push to Preview action
- [x] 5.4 實作 plugin sandbox 的 Pull from Preview 邏輯：從本地 server `GET /ui.json`，依 `catalogFigmaMap` 的 `figmaKey` 呼叫 `figma.importComponentByKeyAsync` 建立 instance，layout 組件建立 Auto Layout frame，確保 Figma Plugin provides Pull from Preview action
- [x] 5.5 實作 `figma.clientStorage` 的 port 讀取與儲存，預設 `5173`，確保 Figma Plugin stores server port in local plugin storage
- [x] 5.6 實作 Push/Pull 失敗時的錯誤處理：server 未啟動時顯示提示訊息；找不到 Figma library component 時 fallback 為 placeholder frame
