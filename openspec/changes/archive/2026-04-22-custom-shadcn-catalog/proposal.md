## Why

目前 `basicCatalog` 使用 a2ui 內建樣式渲染元件，與專案已採用的 shadcn/ui design token 系統完全脫節，導致 AI Agent 產生的 UI 無法融入專案的視覺語言。

## What Changes

- 建立 `src/catalog/` 目錄，包含自訂 catalog 與所有元件實作
- 用 `createComponentImplementation` + shadcn/ui 元件逐一取代 basicCatalog 的 18 個元件（`Text`, `Image`, `Icon`, `Video`, `AudioPlayer`, `Row`, `Column`, `List`, `Card`, `Tabs`, `Modal`, `Divider`, `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput`）
- `App.tsx` 改為使用新的 `customCatalog`，移除對 `basicCatalog` 的依賴
- `public/ui.json` 的 `catalogId` 改為 `"custom"` 以對應新 catalog id
- 安裝所需的 shadcn/ui 元件：`card`, `input`, `checkbox`, `tabs`, `dialog`, `slider`

## Non-Goals (optional)

- 不修改 a2ui 的 prop schema（`TextApi`, `ButtonApi` 等保持不動）
- 不實作 basicCatalog 未提供的新元件
- 不改變 `useJsonPolling` 或訊息處理流程

## Capabilities

### New Capabilities

- `custom-shadcn-catalog`: 以 shadcn/ui 元件實作的自訂 a2ui catalog，取代 basicCatalog 的所有元件渲染

### Modified Capabilities

- `agent-driven-ui`: `MessageProcessor` 改用 `customCatalog` 初始化（原為 `basicCatalog`）

## Impact

- Affected specs: `custom-shadcn-catalog` (新增), `agent-driven-ui` (修改)
- Affected code:
  - `src/App.tsx` — 換掉 basicCatalog import
  - `src/catalog/index.ts` — 新增 customCatalog 入口
  - `src/catalog/components/` — 18 個元件實作檔案
  - `public/ui.json` — 更新 catalogId
  - `components.json` — 可能新增 shadcn 元件
  - `src/components/ui/` — 新增 shadcn 元件檔案
