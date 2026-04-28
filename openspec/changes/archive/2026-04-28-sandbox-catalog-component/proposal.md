## Why

目前 A2UI 的 catalog 在打包後即固定，AI Agent 僅能使用預先定義的元件。當使用者提出 catalog 未涵蓋的客製化需求（如圖表、複雜互動元件、需引用第三方 library 的元件）時，AI 無法在不重新建構應用程式的情況下達成畫面需求，導致完全自動化的 UI 生成受到嚴重限制。

## What Changes

- 在 `src/catalog/components/` 新增 `Sandbox` 元件實作
- `Sandbox` 接受 `source`（ESM 字串）與 `props`（傳入沙箱的資料）作為 props
- 元件以 `<iframe sandbox="allow-scripts">` 渲染，iframe 內透過 esm.sh 動態載入第三方 library
- 主應用程式透過 `postMessage` 將 props 傳入 iframe；iframe 以 `ResizeObserver` 回報高度，主應用程式據此調整 iframe 高度
- 更新 `skills/generate-ui/references/` 新增 `Sandbox.md` 元件文件，讓 AI Agent 知道何時改用 `Sandbox`
- 更新 `skills/generate-ui/SKILL.md`，說明「catalog 沒有對應元件時，使用 Sandbox」的決策規則

## Non-Goals (optional)

- 不支援 Sandbox 元件與主應用程式共享 React context 或 A2UI state（iframe 完全獨立）
- 不實作離線快取（esm.sh 需要網路連線）
- 不對 AI 產生的 source code 進行安全性掃描（本工具為本地端 AI Agent 工具，非對外服務）
- 不修改 A2UI core（`@a2ui/web_core`、`@a2ui/react`）

## Capabilities

### New Capabilities

- `sandbox-catalog-component`: iframe 沙箱元件，允許 AI Agent 在 runtime 注入任意 React 元件（含第三方 library），無需重新打包應用程式

### Modified Capabilities

- `custom-shadcn-catalog`: 新增 `Sandbox` 至 catalog，catalog 元件數量從 18 增為 19

## Impact

- 新增檔案：`src/catalog/components/sandbox.tsx`
- 新增檔案：`skills/generate-ui/references/Sandbox.md`
- 修改檔案：`skills/generate-ui/SKILL.md`（新增 Sandbox 使用規則）
- 修改檔案：`src/catalog/components/__tests__/catalog-components.test.tsx`（新增 Sandbox 測試）
- 間接影響：`skills/generate-ui/scripts/ui.json`（AI 產生的 UI 可開始使用 Sandbox 元件）
- 新增依賴：無（使用原生 iframe + esm.sh CDN，不需新增 npm 套件）
