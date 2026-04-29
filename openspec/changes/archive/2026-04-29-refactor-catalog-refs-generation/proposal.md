## Why

`generate-catalog-refs.mjs` 透過 filename → PascalCase → ApiName 字串推斷來找對應的 API 物件，任何命名偏差都會靜默略過。目前 `Box`、`Sandbox`（local const 未 export）以及 `CheckBox`（大寫 B 不一致）三個元件的 reference 全部漏掉，導致 AI skill 無法知道這些元件的存在。

## What Changes

- `src/catalog/components/box.tsx`：將 `BoxApi` 改為 named export
- `src/catalog/components/sandbox.tsx`：將 `SandboxApi` 改為 named export
- 新增 `src/catalog/api-registry.ts`：集中匯出所有 catalog API 物件（custom + basic_catalog），作為 script 唯一的 import 來源，不含任何 JSX
- `scripts/generate-catalog-refs.mjs` → `scripts/generate-catalog-refs.ts`：改為 TypeScript，直接 import `api-registry.ts`，移除 filename → ApiName 推斷邏輯
- `package.json`：`generate:refs` script 改為 `tsx scripts/generate-catalog-refs.ts`；新增 `tsx` 為 devDependency
- `build:skill` script 對應更新為呼叫新的 generate:refs

## Capabilities

### New Capabilities

（無新 capability — 這是 refactor）

### Modified Capabilities

- `custom-shadcn-catalog`：catalog API 的 export 方式改變（`BoxApi`、`SandboxApi` 從 local const 改為 named export）；產出的 reference 檔案數量從原本缺漏 3 個變為完整涵蓋所有元件

## Impact

- Affected specs: `custom-shadcn-catalog`（BoxApi、SandboxApi export 方式）
- Affected code:
  - `src/catalog/components/box.tsx`
  - `src/catalog/components/sandbox.tsx`
  - `src/catalog/api-registry.ts`（新增）
  - `scripts/generate-catalog-refs.ts`（取代 generate-catalog-refs.mjs）
  - `scripts/generate-catalog-refs.mjs`（刪除）
  - `package.json`
