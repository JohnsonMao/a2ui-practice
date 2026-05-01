## 1. 建立 skill registry

- [x] 1.1 新增 `src/catalog/skill.ts`，實作「skill registry 使用 module-level array，而非 global singleton」：以 module-level array 作為 registry，`a2ui.skill()` 提供「skill.ts provides a2ui.skill() registration function」的登記副作用，`getRegistry()` 回傳登記陣列副本，型別須使用 `ComponentApi` 與 `ZodTypeAny`

## 2. 建立各組件的 *.skill.ts 檔案

- [x] [P] 2.1 新增 `src/catalog/components/audio-player.skill.ts`
- [x] [P] 2.2 新增 `src/catalog/components/badge.skill.ts`
- [x] [P] 2.3 新增 `src/catalog/components/box.skill.ts`
- [x] [P] 2.4 新增 `src/catalog/components/button.skill.ts`
- [x] [P] 2.5 新增 `src/catalog/components/card.skill.ts`
- [x] [P] 2.6 新增 `src/catalog/components/checkbox.skill.ts`
- [x] [P] 2.7 新增 `src/catalog/components/choice-picker.skill.ts`
- [x] [P] 2.8 新增 `src/catalog/components/column.skill.ts`
- [x] [P] 2.9 新增 `src/catalog/components/date-picker.skill.ts`
- [x] [P] 2.10 新增 `src/catalog/components/date-time-input.skill.ts`
- [x] [P] 2.11 新增 `src/catalog/components/dialog.skill.ts`
- [x] [P] 2.12 新增 `src/catalog/components/divider.skill.ts`
- [x] [P] 2.13 新增 `src/catalog/components/icon.skill.ts`
- [x] [P] 2.14 新增 `src/catalog/components/image.skill.ts`
- [x] [P] 2.15 新增 `src/catalog/components/list.skill.ts`
- [x] [P] 2.16 新增 `src/catalog/components/modal.skill.ts`
- [x] [P] 2.17 新增 `src/catalog/components/row.skill.ts`
- [x] [P] 2.18 新增 `src/catalog/components/sandbox.skill.ts`
- [x] [P] 2.19 新增 `src/catalog/components/slider.skill.ts`
- [x] [P] 2.20 新增 `src/catalog/components/table.skill.ts`
- [x] [P] 2.21 新增 `src/catalog/components/tabs.skill.ts`
- [x] [P] 2.22 新增 `src/catalog/components/text.skill.ts`
- [x] [P] 2.23 新增 `src/catalog/components/text-field.skill.ts`
- [x] [P] 2.24 新增 `src/catalog/components/typography.skill.ts`
- [x] [P] 2.25 新增 `src/catalog/components/video.skill.ts`

## 3. 更新 generate-catalog-refs.ts

- [x] 3.1 更新 `scripts/generate-catalog-refs.ts`
- [x] 3.2 更新 `scripts/generate-catalog-refs.ts` 的 Markdown 生成邏輯

## 4. 移除 api-registry.ts

- [x] 4.1 刪除 `src/catalog/api-registry.ts`
- [x] 4.2 確認無任何檔案仍 import 自 `api-registry`：執行 `pnpm typecheck` 確認無 TypeScript 錯誤

## 5. 更新 add-to-catalog skill

- [x] 5.1 更新 `skills/add-to-catalog/SKILL.md`

## 6. 驗證

- [x] 6.1 執行 `pnpm generate:refs` 確認 25 個 Markdown 檔案正確生成
- [x] 6.2 執行 `pnpm typecheck` 確認全專案無 TypeScript 錯誤

## 7. 型別安全性強化

- [x] 7.1 為 `a2ui.skill()` 加入泛型限制：在 `src/catalog/skill.ts` 加入 `SkillExampleResult<Api extends ComponentApi>` = `{ id: string; component: string } & InferredComponentApiSchemaType<Api>`，將函式簽名改為 `skill<Api extends ComponentApi>(api: Api, options: { example: () => SkillExampleResult<Api>; notes?: string }): void`；`SkillEntry` 保持非泛型（儲存異質清單）
- [x] 7.2 修正 `src/catalog/__tests__/skill.test.ts` 中的 `any` 型別：新增 `import { z } from 'zod'`，以 `z.object({})` 取代所有 `{} as any`，並更新傳入 `a2ui.skill()` 的 example 函式以包含 `id` 與 `component` 欄位（符合新型別約束）
- [x] 7.3 修正 `scripts/generate-catalog-refs.ts` 中的 `any` 型別：在 import 後定義 `ZodInternalDef`、`ZodInspectable` 型別與 `inspect(zodType: ZodTypeAny): ZodInspectable` helper（使用雙重 `as unknown as` 轉換，避免 `any`），再替換所有 `(zodType as any)` 與 `(o as any)` 為 `inspect(zodType)` 與 `inspect(o)`
- [x] 7.4 執行 `pnpm check`（lint + typecheck + test）確認全數通過
