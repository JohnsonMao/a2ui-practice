## Context

目前 `src/catalog/api-registry.ts` 是手動維護的中央 re-export 清單，供 `scripts/generate-catalog-refs.ts` 在 build time import 所有 `XxxApi`。新增組件時必須記得在此清單加一行，遺漏時 CLI 不會報錯，只是靜默跳過。

`generate-catalog-refs.ts` 的 example 值由通用的 `exampleValue()` 函式依 prop name / type 推導，無法表達組件的真實使用意圖（例如 Button 的 example 應該展示 `variant: "primary"` 搭配 Text 子組件）。

Figma Code Connect 採用 colocate 模式：每個組件旁邊放一個 `.figma.tsx`，由 CLI 掃描執行副作用（`figma.connect()` 呼叫），再從 in-process registry 讀取所有登記資料。本次設計採用相同模式。

## Goals / Non-Goals

**Goals:**

- 以 colocate 的 `*.skill.ts` 取代中央 `api-registry.ts`，消除手動維護清單
- 讓每個組件能透過 `a2ui.skill()` 自訂 AI skill reference 的 `example` 與 `notes`
- 保持向後相容：無 `*.skill.ts` 的組件從 schema 自動推導（現有行為）
- 不影響 runtime（`src/catalog/index.ts` 的 Vite glob 不變）

**Non-Goals:**

- 不引入 `a2ui.string()`、`a2ui.enum()` 等 prop mapper
- 不改變生成的 Markdown 輸出格式
- 不支援遠端發布（未來擴展，非本次範圍）

## Decisions

### skill registry 使用 module-level array，而非 global singleton

`src/catalog/skill.ts` 維護一個 module-level `registry` array。`a2ui.skill()` 將登記資料 push 進去；`getRegistry()` 回傳副本。

**為什麼不用 global（`globalThis`）：** CLI 在 Node.js 用 `tsx` 執行，無多 process 情境，module-level 已足夠且更可預測。

**替代方案考慮：** Map（以 api.name 為 key）— 拒絕，因為需要偵測重複登記但不增加複雜度；直接 export default — 拒絕，因為無 import 就等同無 export，無法做側效登記。

### CLI 用動態 import 逐一執行 *.skill.ts 副作用

`generate-catalog-refs.ts` 用 `fast-glob`（或 Node.js 內建 glob）找到所有 `src/catalog/components/*.skill.ts`，對每個路徑做 `await import(path)`，觸發 `a2ui.skill()` 副作用，最後呼叫 `getRegistry()`。

**為什麼不用 `import.meta.glob`：** 這是 Vite 專屬 API，CLI 在 Node.js 下不可用。

**為什麼不重新掃描 *.tsx 收集 *Api：** 所有組件都會有 `*.skill.ts`，不需要 fallback 掃描。

### *.skill.ts 只補充 example 與 notes，不重複定義 props

`a2ui.skill(XxxApi, { example, notes })` 的 `example` 是一個回傳 JSON object 的函式；`notes` 是可選的說明字串。Props 的 type / description 繼續從 `XxxApi.schema` 推導，不重複定義。

**為什麼不像 Figma 加 prop mappers（`a2ui.string()` 等）：** Zod schema 的 `.describe()` 已提供足夠的 AI 提示，重複定義增加維護負擔。

### api-registry.ts 刪除，不保留

刪除後現有的 `__tests__/api-registry.test.ts`（若有）需一併移除或更新。`add-to-catalog` skill 的指引也需更新，改為建立 `*.skill.ts` 而非更新 `api-registry.ts`。

## Risks / Trade-offs

- [Risk] `*.skill.ts` 裡 import 了 `*.tsx`，而 `*.tsx` 有 JSX → tsx CLI 可以處理，但若組件有瀏覽器專用 API（如 `sandbox.tsx` 的 `window`/`import.meta.env`）會在 Node.js 下報錯。→ Mitigation：`*.skill.ts` 只 import `XxxApi`（純 TS object），不 import `XxxImpl`（含 JSX / browser API）。
- [Risk] 漏建 `*.skill.ts` 時 CLI 靜默跳過 → 等同現有 `api-registry.ts` 漏加的問題。→ Mitigation：`add-to-catalog` skill 更新後會明確要求建立 `*.skill.ts`，可在 CI 加 lint 規則（未來）。

## Migration Plan

1. 新增 `src/catalog/skill.ts`
2. 新增 25 個 `*.skill.ts`（每個組件一個）
3. 更新 `scripts/generate-catalog-refs.ts`
4. 確認 `pnpm generate:refs` 輸出與舊版一致
5. 刪除 `src/catalog/api-registry.ts`
6. 更新 `skills/add-to-catalog/SKILL.md`
7. 更新受影響的測試檔案

Rollback：git revert 即可，無資料遷移。
