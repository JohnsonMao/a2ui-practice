## Why

自訂 catalog 的輸入元件（TextField、CheckBox、Slider 等）在 `ui.json` 中使用 literal 值（`"value": "Johnson Mao"`），導致使用者無法編輯欄位——每次元件重新渲染時輸入都會被還原。框架的 `DataModel` 已支援 path binding，但 catalog 元件尚未實作此機制。

## What Changes

- `public/ui.json`：新增 `updateDataModel` 訊息初始化 DataModel；將所有輸入元件的 `value` 從 literal string 改為 path binding 物件（`{ "path": "/..." }`）
- `src/catalog/components/text-field.tsx`：改為讀取 path binding，維護本地 state，並在 onChange 時透過 `setValue` 寫回 DataModel
- `src/catalog/components/checkbox.tsx`：同上
- `src/catalog/components/slider.tsx`：同上
- `src/catalog/components/choice-picker.tsx`：同上
- `src/catalog/components/date-time-input.tsx`：同上

## Non-Goals

- 不實作雙向同步（agent 端寫回 DataModel 後觸發 polling 覆蓋的衝突解決）
- 不更改非輸入性元件（Text、Image、Button 等）
- 不修改 `@a2ui/react` 框架本身

## Capabilities

### New Capabilities

（無——此變更修正既有 custom-shadcn-catalog 能力的實作，不引入新能力）

### Modified Capabilities

- `custom-shadcn-catalog`：輸入元件須支援 path binding 與本地 state 管理，以實現可編輯行為

## Impact

- Affected specs: `custom-shadcn-catalog`
- Affected code:
  - `public/ui.json`
  - `src/catalog/components/text-field.tsx`
  - `src/catalog/components/checkbox.tsx`
  - `src/catalog/components/slider.tsx`
  - `src/catalog/components/choice-picker.tsx`
  - `src/catalog/components/date-time-input.tsx`
