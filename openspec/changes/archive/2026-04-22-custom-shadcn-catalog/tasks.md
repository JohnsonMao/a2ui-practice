## 1. 安裝 shadcn 元件

- [x] 1.1 執行 `pnpm dlx shadcn@latest add card input checkbox tabs dialog slider` 安裝所需的 shadcn/ui 元件，確認 `src/components/ui/` 下新增對應檔案

## 2. 建立 catalog 目錄結構與入口（目錄結構：`src/catalog/` 集中管理）

- [x] 2.1 建立 `src/catalog/index.ts`，匯出 `customCatalog`（`new Catalog("custom", [...所有元件實作])`）；catalog id 設為 `"custom"` 符合設計決策

## 3. 實作 Content 元件（提供 shadcn-based component catalog，每個元件用 `createComponentImplementation` 實作）

- [x] [P] 3.1 建立 `src/catalog/components/text.tsx`：用 `createComponentImplementation(TextApi, ...)` + shadcn Typography 樣式實作 `Text` 元件，對應 `TextApi` 的 `text`（必填）與 `variant`（`h1`/`h2`/`h3`/`h4`/`h5`/`caption`/`body` → 對應 Tailwind class）
- [x] [P] 3.2 建立 `src/catalog/components/image.tsx`：用 `createComponentImplementation(ImageApi, ...)` + `<img>` + Tailwind 實作 `Image` 元件，對應 `ImageApi` 的 `src`、`alt`、`fit` 屬性
- [x] [P] 3.3 建立 `src/catalog/components/icon.tsx`：用 `createComponentImplementation(IconApi, ...)` + lucide-react 實作 `Icon` 元件，對應 `IconApi` 的 `name` 屬性，不支援的 icon name 回退為空節點
- [x] [P] 3.4 建立 `src/catalog/components/video.tsx`：用 `createComponentImplementation(VideoApi, ...)` + HTML `<video>` 原生元素（Video / AudioPlayer 使用 HTML 原生元素）+ Tailwind 實作 `Video` 元件，對應 `VideoApi` 的 `src`、`autoplay`、`controls`、`loop` 屬性
- [x] [P] 3.5 建立 `src/catalog/components/audio-player.tsx`：用 `createComponentImplementation(AudioPlayerApi, ...)` + HTML `<audio>` 原生元素（Video / AudioPlayer 使用 HTML 原生元素）+ Tailwind 實作 `AudioPlayer` 元件，對應 `AudioPlayerApi` 的 `src`、`autoplay`、`controls` 屬性

## 4. 實作 Layout 元件（提供 shadcn-based component catalog）

- [x] [P] 4.1 建立 `src/catalog/components/row.tsx`：用 `<div className="flex flex-row">` 實作 `Row` 元件，對應 `RowApi` 的 `children`、`gap`、`align`、`justify` 屬性
- [x] [P] 4.2 建立 `src/catalog/components/column.tsx`：用 `<div className="flex flex-col">` 實作 `Column` 元件，對應 `ColumnApi` 的 `children`、`gap`、`align` 屬性
- [x] [P] 4.3 建立 `src/catalog/components/list.tsx`：用 shadcn 無樣式列表或 `<ul>` + Tailwind 實作 `List` 元件，對應 `ListApi` 的 `children`、`dividers` 屬性
- [x] [P] 4.4 建立 `src/catalog/components/card.tsx`：用 shadcn `Card` 元件實作，對應 `CardApi` 的 `children`、`title`、`subtitle` 屬性
- [x] [P] 4.5 建立 `src/catalog/components/tabs.tsx`：用 shadcn `Tabs` 元件實作，對應 `TabsApi` 的 `tabs`（含 label 與 children）、`defaultTab` 屬性
- [x] [P] 4.6 建立 `src/catalog/components/modal.tsx`：用 shadcn `Dialog` 元件實作 `Modal` 元件，對應 `ModalApi` 的 `open`、`title`、`children`、`onClose` 屬性
- [x] [P] 4.7 建立 `src/catalog/components/divider.tsx`：用 shadcn `Separator` 或 `<hr>` + Tailwind 實作 `Divider` 元件，對應 `DividerApi` 的 `orientation` 屬性

## 5. 實作 Input 元件（提供 shadcn-based component catalog）

- [x] [P] 5.1 建立 `src/catalog/components/button.tsx`：用 shadcn `Button` 元件實作，對應 `ButtonApi` 的 `label`、`style`（`primary`/`secondary`/`destructive`/`text` → shadcn variant）、`disabled`、`onClick` 屬性
- [x] [P] 5.2 建立 `src/catalog/components/text-field.tsx`：用 shadcn `Input` 元件實作 `TextField`，對應 `TextFieldApi` 的 `label`、`placeholder`、`value`、`onChange`、`disabled` 屬性
- [x] [P] 5.3 建立 `src/catalog/components/checkbox.tsx`：用 shadcn `Checkbox` 元件實作 `CheckBox`，對應 `CheckBoxApi` 的 `label`、`checked`、`onChange`、`disabled` 屬性
- [x] [P] 5.4 建立 `src/catalog/components/choice-picker.tsx`：用 shadcn `Select` 元件實作 `ChoicePicker`，對應 `ChoicePickerApi` 的 `options`（含 label/value）、`value`、`onChange`、`disabled` 屬性
- [x] [P] 5.5 建立 `src/catalog/components/slider.tsx`：用 shadcn `Slider` 元件實作，對應 `SliderApi` 的 `min`、`max`、`step`、`value`、`onChange`、`disabled` 屬性
- [x] [P] 5.6 建立 `src/catalog/components/date-time-input.tsx`：用 HTML `<input type="datetime-local">` + shadcn Input 樣式實作 `DateTimeInput`，對應 `DateTimeInputApi` 的 `value`、`onChange`、`disabled`、`label` 屬性

## 6. 整合 catalog 與更新 App

- [x] 6.1 更新 `src/catalog/index.ts`，確認所有 18 個元件都正確匯入並包含在 `customCatalog` 的元件陣列中（Provide shadcn-based component catalog、component prop schemas unchanged）
- [x] 6.2 更新 `src/App.tsx`：移除 `basicCatalog` import，改用 `customCatalog`，完成 Initialize MessageProcessor with basicCatalog → customCatalog 的替換（對應規格：Initialize MessageProcessor with basicCatalog）
- [x] 6.3 更新 `public/ui.json` 的 `catalogId` 從 `"https://a2ui.org/specification/v0_9/basic_catalog.json"` 改為 `"custom"`
- [x] 6.4 更新 `src/App.test.tsx`：將 mock 的 `basicCatalog` 改為 mock `customCatalog`，確保測試通過

## 7. 驗證

- [x] 7.1 執行 `pnpm test` 確認所有測試通過
- [x] 7.2 執行 `pnpm dev`，在瀏覽器確認 `ui.json` 的元件正確以 shadcn 樣式渲染（shadcn design tokens 套用）
