## Context

目前 A2UI 應用程式的 catalog 在 Vite 打包時透過 `import.meta.glob` 靜態收錄所有元件，打包後即無法新增元件。AI Agent 操作 `generate-ui` skill 時只能寫入 `ui.json`，無法修改 React 原始碼或觸發重新打包，導致遇到 catalog 未涵蓋的客製化需求（圖表、特殊互動、第三方 library）時，AI 無法達成畫面需求。

A2UI 的 `Catalog` 類別以 `Map<name, impl>` 儲存元件，`customCatalog` 在 `src/catalog/index.ts` 建立。`App.tsx` 以 `MessageProcessor` 處理 `ui.json` 訊息並渲染至 `A2uiSurface`。

## Goals / Non-Goals

**Goals:**

- 在 catalog 新增 `Sandbox` 元件，讓 AI 可在 `ui.json` 中直接傳入 React 元件 source code
- 透過 `<iframe sandbox="allow-scripts">` 實作沙箱隔離
- 透過 `esm.sh` CDN 解決第三方 library 的 runtime import 問題
- 透過 `postMessage` 實現 props 雙向同步與高度自適應
- 更新 `SKILL.md` 與 `references/Sandbox.md` 讓 AI 知道此元件的使用時機

**Non-Goals:**

- 不讓 Sandbox 元件共享主 app 的 React context、signal 或 A2UI state
- 不實作 esm.sh 離線快取或 service worker 攔截
- 不對 AI 產生的 source code 進行沙箱安全審計（本地工具，非對外服務）
- 不修改 `@a2ui/web_core` 或 `@a2ui/react` 核心套件

## Decisions

### iframe 作為沙箱隔離邊界（而非 `@babel/standalone` + `new Function`）

第三方 library（如 chart.js）需要 `import` 語句。`@babel/standalone` 僅能轉換 JSX 語法，無法解析 ES module import。若使用 `new Function()` + window globals，React 實例可共享，但第三方 library 的 React peer dependency 會連到不同的 React 實例，觸發 `Invalid hook call`。

**決定**：使用 iframe 完整隔離。iframe 內部使用 esm.sh 載入包含 React 的完整 ES module，不與主 app 共享任何 React 實例。

**替代方案考慮**：
- `@codesandbox/sandpack-react`：功能完整但打包體積過大（+300KB），且需要 service worker，複雜度超出需求
- `esm.sh?bundle`：將 source code 送至 esm.sh 打包 API，但需要非同步請求且增加延遲，AI 無法即時看到結果

### props 透過 postMessage 傳遞

iframe 與主 app 位於同 origin（均為 `localhost:5173`），可雙向 postMessage。主 app 在 `Sandbox` 元件 mount 時及 props 變更時發送 `{ type: 'a2ui:props', payload: props }` 訊息；iframe 監聽 `message` 事件並重新渲染。

### iframe 高度自適應

iframe 預設高度為 `0`，iframe 內部以 `ResizeObserver` 觀察 root element 高度，透過 `postMessage` 回傳 `{ type: 'a2ui:resize', height: number }`，主 app 的 `Sandbox` 元件動態設定 iframe 高度。

### iframe 的 HTML shell 以 `srcdoc` 注入（而非獨立 HTML 檔案）

使用 `srcdoc` 可讓整個 Sandbox 實作集中在單一 `sandbox.tsx` 檔案，不需要在 `public/` 新增額外的 HTML 入口，保持 skill 建構流程不變。

shell 結構：
```html
<!DOCTYPE html>
<html>
<head>
  <script type="importmap">{ "imports": { "react": "https://esm.sh/react@18", "react-dom/client": "https://esm.sh/react-dom@18/client" } }</script>
</head>
<body><div id="root"></div>
<script type="module">
  import React from 'react';
  import { createRoot } from 'react-dom/client';
  // [AI source code 插入此處，以 blob URL 動態 import]
  // postMessage 接收 props，ResizeObserver 回傳高度
</script>
</body>
</html>
```

AI 的 source code 透過 `URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))` 建立 blob URL 後以動態 `import()` 載入，作為 default export 的 React 元件。

### SKILL.md 決策規則：catalog 優先，Sandbox 為後備

AI 的決策樹：
1. 檢視 `references/` 下是否有對應元件文件 → 有則使用 catalog 元件
2. 無對應元件 → 使用 `Sandbox` 元件，source 欄位填入完整 ES module 字串

## Risks / Trade-offs

- **[風險] esm.sh 需要網路連線** → 緩解：在 SKILL.md 與 Sandbox.md 中說明此限制，離線情境不適用 Sandbox
- **[風險] blob URL + importmap 相容性** → `importmap` 在 blob URL 的 module context 中，部分瀏覽器（Chrome 89+、Firefox 108+）支援，但較舊版本可能需要 fallback。緩解：在 Sandbox.md 記錄瀏覽器需求（Chrome 89+）
- **[Trade-off] 每個 Sandbox 實例是獨立 iframe** → 若頁面有多個 Sandbox，每個都是獨立沙箱，props 只能單向傳入，Sandbox 之間無法共享狀態
- **[風險] AI 產生的 source code 語法錯誤** → 緩解：Sandbox 元件捕獲 iframe `error` 事件並顯示錯誤訊息覆蓋層，而非白屏
