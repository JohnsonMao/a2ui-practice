## Why

目前 `api-registry.ts` 是手動維護的中央清單，新增組件時必須記得手動加入，且 `generate-catalog-refs.ts` 的 example 值是由通用規則自動推導，無法針對單一組件客製化。這個架構讓 skill reference 的品質受限於通用邏輯，無法表達組件的真實使用意圖。

## What Changes

- 新增 `src/catalog/skill.ts`：提供 `a2ui.skill()` 登記函式與 `getRegistry()` 讀取函式，作為輕量 registry
- `a2ui.skill<Api extends ComponentApi>()` 以泛型限制 `example` 回傳型別：`{ id: string; component: string } & InferredComponentApiSchemaType<Api>`，確保 example 的 shape 與 API schema 一致
- 每個 catalog 組件旁邊新增對應的 `*.skill.ts`（colocate）：呼叫 `a2ui.skill(XxxApi, { example, notes })` 進行登記，無需 export
- 刪除 `src/catalog/api-registry.ts`：由各 `*.skill.ts` 的 colocate 登記取代，消除手動維護清單
- 更新 `scripts/generate-catalog-refs.ts`：改為 glob 掃描 `*.skill.ts` → 執行副作用 → `getRegistry()` → 生成 Markdown；並以 `ZodInspectable` 型別消除所有 `any`
- 更新 `skills/add-to-catalog/SKILL.md`：指示 Agent 新增組件時同步建立對應的 `*.skill.ts`

## Non-Goals (optional)

- 不引入 `a2ui.string()`、`a2ui.enum()` 等 prop mapper（props type 繼續從 Zod schema 自動推導）
- 不改變生成的 Markdown 輸出格式
- 不改變 runtime 的 `src/catalog/index.ts`（仍用 Vite glob 掃描 `*.tsx`）

## Capabilities

### New Capabilities

- `catalog-skill-connect`: 以 colocate `*.skill.ts` 取代中央 `api-registry.ts`，讓每個組件能自訂 AI skill reference 的 example 與 notes

### Modified Capabilities

- `add-to-catalog-skill`: 新增組件的流程需包含建立 `*.skill.ts` 步驟

## Impact

- 刪除：`src/catalog/api-registry.ts`
- 新增：`src/catalog/skill.ts`
- 新增：`src/catalog/components/*.skill.ts`（每個組件一個，共 25 個）
- 修改：`scripts/generate-catalog-refs.ts`
- 修改：`skills/add-to-catalog/SKILL.md`
