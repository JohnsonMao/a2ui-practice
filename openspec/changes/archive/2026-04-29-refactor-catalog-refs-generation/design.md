## Context

目前 `generate-catalog-refs.mjs` 以 filename → PascalCase → ApiName 字串推斷找 API 物件，再從 `@a2ui/web_core/src/v0_9/basic_catalog/components/basic_components.js` 查找。任何命名偏差（如 `CheckBox` 大寫 B）或定義在 component file 內的 local API（`BoxApi`、`SandboxApi`）都會靜默略過。目前漏掉 Box、Sandbox、CheckBox 三個元件的 reference 檔案。

## Goals / Non-Goals

**Goals:**

- 所有 catalog 元件的 API 都出現在 `skills/generate-ui/references/` 中
- 新增元件只需在 `api-registry.ts` 加一行，無需注意命名規範對齊
- Script 改為 TypeScript，享有型別保護與 IDE 支援
- 使用 `tsx` 在 Node 環境直接執行 TS，不需要 bun

**Non-Goals:**

- 不改變 reference Markdown 的輸出格式
- 不修改 `@a2ui/web_core` 的 API 定義
- 不修改 `src/catalog/index.ts` 的動態 glob import（仍用於 runtime）

## Decisions

### BoxApi 與 SandboxApi 改為 named export

**決策**：將 `box.tsx` 中的 `const BoxApi` 與 `sandbox.tsx` 中的 `const SandboxApi` 改為 `export const`。

**理由**：`api-registry.ts` 需要直接 import 這些物件。目前它們是 local const 只因為沒有需求需要 export，改為 named export 不影響既有邏輯，也不需要搬移到其他檔案。

**替代方案**：把 API 物件搬到獨立的 `*-api.ts` 檔案 — 增加不必要的檔案數量，本方案選擇最小改動。

### api-registry.ts 作為 script 的唯一 API 來源

**決策**：建立 `src/catalog/api-registry.ts`，集中 export 所有 catalog API 物件，包含 basic_catalog 引入與 custom API（Box、Sandbox）。此檔案不 import 任何 React 或 JSX。

**理由**：
- Script 只需要 API 的 schema（Zod 物件），不需要 React component
- 單一入口讓「有哪些 API 需要產生 reference」一目了然，變成明確的 source of truth
- 避免 script 動態掃描 filename 再推斷 ApiName 的脆弱性

**替代方案**：讓 component files export API，script 直接掃描所有 .tsx 並 import — 但 tsx 動態 import 帶有 JSX/React，需要 transpile，增加 script 複雜度。

### Script 改為 TypeScript，使用 tsx 執行

**決策**：`generate-catalog-refs.mjs` → `generate-catalog-refs.ts`，`package.json` 的 `generate:refs` 改為 `tsx scripts/generate-catalog-refs.ts`。

**理由**：
- 直接 import `api-registry.ts` 享有 TypeScript 型別
- `tsx` 在 Node 環境執行 TS，無需 compile step，與既有 `vitest`/`vite` 工具鏈一致
- 相較 `bun`：tsx 只需要 Node（CI 相容性高），且不改變 package manager

**替代方案**：`bun` 也能執行 TS — 但需要安裝 bun runtime，增加環境依賴。

## Risks / Trade-offs

- `api-registry.ts` 必須手動維護：新增元件後需記得加一行 → 透過 `generate:refs` 執行後輸出數量可驗證
- `tsx` 執行 path alias（`@/`）可能需要額外設定 → `api-registry.ts` 不使用 path alias，只用相對路徑 import，避免此問題
