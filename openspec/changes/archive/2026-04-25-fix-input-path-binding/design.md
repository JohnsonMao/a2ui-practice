## Context

`public/ui.json` 目前使用 literal 值初始化輸入元件（例如 `"value": "Johnson Mao"`），使得元件成為純粹由 agent 控制的 controlled component，使用者輸入後若無 agent 回應則被還原。

框架（`@a2ui/web_core`）已內建 `DataModel`——一個以 JSON Pointer 定址的響應式記憶體樹。`MessageProcessor` 可透過 `updateDataModel` 訊息初始化此樹；catalog 元件可在 props 中以 `{ "path": "/..." }` 語法指向樹上的節點，`setValue` 會寫回樹中並觸發重新渲染。

自訂 catalog 元件（`src/catalog/components/*.tsx`）目前只讀取 literal string（`typeof props.value === 'string'`），未實作 path binding，導致 `setValue` 呼叫無效果。

## Goals / Non-Goals

**Goals:**

- 輸入元件在使用者打字 / 選取後即時顯示變更，不等待 polling
- `ui.json` 改用 path binding，讓 DataModel 成為輸入值的單一真相來源
- 保持現有 literal-only 的元件（Text、Image、Button 等）不受影響

**Non-Goals:**

- 解決 DataModel 與 polling 覆蓋的競態（agent 更新 ui.json 後可能蓋掉使用者輸入）
- 修改 `@a2ui/react` 框架本身或其內建元件
- 為非輸入元件加 path binding 支援

## Decisions

### 以 `useState` + `useEffect` 管理本地 state，搭配 path binding 寫回 DataModel

元件實作模式：

```tsx
const rawValue = props.value  // 可能是 string 或 { path: string }
const initialValue = typeof rawValue === 'string' ? rawValue : ''

const [localValue, setLocalValue] = useState(initialValue)

// 當 literal value 從外部更新時同步（例如 polling 帶來新值）
useEffect(() => {
  if (typeof rawValue === 'string') setLocalValue(rawValue)
}, [rawValue])

const handleChange = (newVal: string) => {
  setLocalValue(newVal)       // 立即更新 UI
  props.setValue?.(newVal)    // 寫回 DataModel（path binding 時有效）
}
```

**選擇此方案而非純 path binding（不加 local state）的原因**：若 agent 遲未回應或不支援 path binding，元件仍可正常運作；且 literal value 模式（demo / 靜態展示）也不會壞掉。

**替代方案：只加 local state，完全忽略 path binding**——較簡單，但浪費已有的 DataModel 基礎設施，且日後難以接入真實 agent。

### `ui.json` 加入 `updateDataModel` 訊息初始化 DataModel

在 `createSurface` 之後、`updateComponents` 之前加入：

```json
{
  "version": "v0.9",
  "updateDataModel": {
    "surfaceId": "main",
    "path": "/",
    "value": {
      "user": { "name": "Johnson Mao", "email": "...", "bio": "..." },
      "prefs": { "theme": "dark", ... },
      "notif": { ... }
    }
  }
}
```

輸入元件的 `value` 改為：

```json
{ "id": "name-field", "component": "TextField",
  "label": "顯示名稱",
  "value": { "path": "/user/name" } }
```

**`App.tsx` 的 polling 過濾邏輯**：目前只過濾重複的 `createSurface`，`updateDataModel` 訊息會直接通過，不需修改。

### path binding 的 props 解析在 catalog 元件層處理，不引入共用 helper

各元件各自處理 `typeof props.value === 'string'` vs `typeof props.value === 'object'` 的分支，避免過早抽象。若未來元件數量增加，再提取 helper。

## Risks / Trade-offs

- **競態：polling 覆蓋使用者輸入** → 若 agent 在使用者輸入後以舊值發送 `updateComponents`，`props.value`（literal）會更新，觸發 `useEffect` 將 `localValue` 還原。緩解：此 change 的 `useEffect` 只同步 literal value，path binding 模式下不會有此問題；但 demo 用的靜態 `ui.json` 理論上不會主動更新，風險低。
- **props 型別**：`TextFieldApi` 的 `value` 型別若已被框架限定為 `string`，path binding 物件（`{ path: string }`）可能觸發 TypeScript 錯誤。需確認 API schema 是否允許 union 型別，或使用 `unknown` cast。
