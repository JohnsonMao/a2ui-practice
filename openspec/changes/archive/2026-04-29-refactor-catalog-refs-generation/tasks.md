## 1. 安裝依賴

- [x] 1.1 在 `package.json` devDependencies 新增 `tsx`（`pnpm add -D tsx`），滿足「Script 改為 TypeScript，使用 tsx 執行」設計決策

## 2. Export catalog API 物件

- [x] [P] 2.1 將 `src/catalog/components/box.tsx` 的 `const BoxApi` 改為 `export const BoxApi`，滿足「BoxApi 與 SandboxApi 改為 named export」設計決策與「BoxApi is accessible without React」規格
- [x] [P] 2.2 將 `src/catalog/components/sandbox.tsx` 的 `const SandboxApi` 改為 `export const SandboxApi`，滿足「BoxApi 與 SandboxApi 改為 named export」設計決策與「SandboxApi is accessible without React」規格

## 3. 建立 api-registry

- [x] 3.1 建立 `src/catalog/api-registry.ts`：import 並 re-export 所有 basic_catalog API（`TextApi`, `ButtonApi`, `ImageApi`, `IconApi`, `VideoApi`, `AudioPlayerApi`, `RowApi`, `ColumnApi`, `ListApi`, `CardApi`, `TabsApi`, `ModalApi`, `DividerApi`, `TextFieldApi`, `CheckBoxApi`, `ChoicePickerApi`, `SliderApi`, `DateTimeInputApi`）以及 custom API（`BoxApi` from `./components/box`, `SandboxApi` from `./components/sandbox`）；此檔案不得 import React 或任何 JSX，滿足「api-registry.ts 作為 script 的唯一 API 來源」設計決策與「Custom catalog component APIs are exported for tooling」規格，以及「api-registry exports all catalog APIs」規格

## 4. 改寫 generate-catalog-refs script

- [x] 4.1 建立 `scripts/generate-catalog-refs.ts`：將 `generate-catalog-refs.mjs` 的全部邏輯移植為 TypeScript，移除「掃描 `src/catalog/components` 檔名 → PascalCase → ApiName」推斷邏輯，改為直接 import `../src/catalog/api-registry`，以 `Object.values(allApis)` 取得所有 API 物件並產生 Markdown reference 檔案；保留 `generateMarkdown`、`resolveZodType`、`cleanDescription`、`extractProps`、`exampleValue` 等輔助函式；輸出目錄仍為 `skills/generate-ui/references/`，滿足「Script 改為 TypeScript，使用 tsx 執行」設計決策與「generate:refs produces reference files for all catalog components」規格
- [x] 4.2 刪除 `scripts/generate-catalog-refs.mjs`（已由 `generate-catalog-refs.ts` 取代）

## 5. 更新 package.json scripts

- [x] 5.1 將 `package.json` 的 `generate:refs` script 從 `node scripts/generate-catalog-refs.mjs` 改為 `tsx scripts/generate-catalog-refs.ts`，滿足「Script 改為 TypeScript，使用 tsx 執行」設計決策

## 6. 驗證

- [x] 6.1 執行 `pnpm generate:refs` 並確認輸出中不出現 `⚠ No API found` 警告，且 `skills/generate-ui/references/` 目錄下存在 `Box.md`、`Sandbox.md`、`CheckBox.md`，滿足「Box reference file generated」、「Sandbox reference file generated」、「CheckBox reference file generated」、「No components silently skipped」規格
