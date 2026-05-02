## Why

現有的 `Table` 元件每個 cell 只接受純字串，無法在 cell 中嵌入按鈕、Badge 或其他互動元件，導致需要用 `Sandbox` 繞道實作可互動表格，增加複雜度且脫離 A2UI 原生元件體系。

## What Changes

- `Table` 元件的 `rows` schema 從 `string[][]` 擴充為 `(string | { id: string })[][]`
- cell 值若為 `{ id: string }` 物件，渲染時呼叫 `buildChild(id)` 插入對應 A2UI 元件
- cell 值若為純字串，行為維持不變（**非 BREAKING**）
- 更新 `references/Table.md`，加入 cell component ref 的用法說明與範例

## Non-Goals (optional)

- 不支援 cell 同時含有文字與元件的混合型態
- 不修改 `columns` 的型別（仍為純字串標頭）
- 不加入 cell 點擊事件或 selection 等互動行為

## Capabilities

### New Capabilities

- `table-cell-component-ref`: Table cell 可引用 A2UI 元件 ID，實現可嵌入按鈕、Badge 等元件的富內容表格

### Modified Capabilities

- `custom-shadcn-catalog`: Table 元件的 `rows` schema 型別擴充，新增 cell component ref 支援

## Impact

- Affected specs: `table-cell-component-ref` (new), `custom-shadcn-catalog` (delta)
- Affected code:
  - `src/catalog/components/table.tsx`
  - `src/catalog/api-registry.ts`
  - `skills/generate-ui/references/Table.md`
