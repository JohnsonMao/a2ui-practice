## 1. 初始化 DataModel（ui.json）

- [x] [P] 1.1 在 `public/ui.json` 加入 `updateDataModel` 訊息初始化 DataModel（`ui.json` 加入 `updateDataModel` 訊息初始化 DataModel）：在 `createSurface` 訊息後插入 `updateDataModel`，以 `path: "/"` 初始化，包含 `user`（name、email、bio）、`prefs`（theme、notifications、language）、`notif`（email、push、frequency）等所有輸入欄位的初始值——對應「ui.json supports DataModel initialization via updateDataModel message」「DataModel initialized on load」
- [x] [P] 1.2 將 `public/ui.json` 中所有輸入元件的 `value` 屬性從 literal 改為 path binding（path binding 的 props 解析在 catalog 元件層處理，不引入共用 helper），例如 `"value": { "path": "/user/name" }`——對應「Input component value resolves from DataModel path」

## 2. TextField 加入本地 state 與 path binding 支援

- [x] 2.1 在 `src/catalog/components/text-field.tsx` 以 `useState` + `useEffect` 管理本地 state，搭配 path binding 寫回 DataModel：以 `useState(initialValue)` 取代直接讀取 `props.value`，`handleChange` 同時呼叫 `setLocalValue` 與 `props.setValue?.(newVal)`（「Input components support path binding via DataModel」「Input components maintain local state for immediate user feedback」「setValue called on text change」）
- [x] 2.2 在 `text-field.tsx` 加入 `useEffect(() => { if (typeof props.value === 'string') setLocalValue(props.value) }, [props.value])`，確保 literal prop 外部更新時本地 state 同步——對應「Local state syncs when literal prop changes」

## 3. CheckBox 加入本地 state 與 path binding 支援

- [x] [P] 3.1 在 `src/catalog/components/checkbox.tsx` 中以 `useState(Boolean(props.value))` 管理 checked state；`onCheckedChange` 同時呼叫 `setChecked` 與 `props.setValue?.(Boolean(val))`——對應「Input components maintain local state for immediate user feedback」與「setValue called on checkbox toggle」
- [x] [P] 3.2 加入 `useEffect` 在 `props.value` 為 boolean 時同步本地 state——對應「Local state syncs when literal prop changes」

## 4. Slider 加入本地 state 與 path binding 支援

- [x] [P] 4.1 在 `src/catalog/components/slider.tsx` 中以 `useState(numericValue)` 管理 value；`onValueChange` 同時呼叫 `setLocalValue` 與 `props.setValue?.(vals[0])`——對應「Input components maintain local state for immediate user feedback」與「setValue called on slider move」
- [x] [P] 4.2 加入 `useEffect` 在 `props.value` 為 number 時同步本地 state——對應「Local state syncs when literal prop changes」

## 5. ChoicePicker 加入本地 state 與 path binding 支援

- [x] [P] 5.1 在 `src/catalog/components/choice-picker.tsx` 中以 `useState(initialValues)` 管理選取的值陣列；`onValueChange` / `onCheckedChange` 同時更新本地 state 並呼叫 `props.setValue?.(newValues)`——對應「Input components maintain local state for immediate user feedback」與「setValue called on choice selection」
- [x] [P] 5.2 加入 `useEffect` 在 `props.value` 為陣列時同步本地 state——對應「Local state syncs when literal prop changes」

## 6. DateTimeInput 加入本地 state 與 path binding 支援

- [x] [P] 6.1 在 `src/catalog/components/date-time-input.tsx` 中以 `useState(stringValue)` 管理日期字串；`onChange` 同時呼叫 `setLocalValue` 與 `props.setValue?.(val)`——對應「Input components maintain local state for immediate user feedback」
- [x] [P] 6.2 加入 `useEffect` 在 `props.value` 為 string 時同步本地 state——對應「Local state syncs when literal prop changes」

## 7. 驗證

- [x] 7.1 啟動 `pnpm dev`，手動驗證 `TextField`、`CheckBox`、`Slider`、`ChoicePicker`、`DateTimeInput` 均可即時顯示使用者輸入，不被還原——對應「TextField reflects keystroke immediately」
- [x] 7.2 執行 `pnpm test`，確認所有既有測試通過，無回歸——對應「Existing prop keys accepted」
