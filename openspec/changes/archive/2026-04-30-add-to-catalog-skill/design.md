## Context

目前專案有 20 個 catalog 元件，分成兩類：
1. **基本元件**（`@a2ui/web_core/v0_9/basic_catalog` 提供）：AudioPlayer、Button、Card 等，不需手動維護
2. **自訂元件**（`src/catalog/components/*.tsx`）：Box、Sandbox，需要開發者手動建立

新增自訂元件需要：
- 在 `src/catalog/components/` 建立 `.tsx`（包含 `XxxApi` Zod schema + `XxxImpl` React 實作）
- 在 `src/catalog/api-registry.ts` 加 export
- 執行 `pnpm generate:refs`（產生 `skills/generate-ui/references/Xxx.md`）
- 執行 `pnpm sync:skill`（同步到 `.agents/skills/`）

這 4 個步驟目前完全依賴開發者手動執行，沒有 Agent 可以觸發的 SKILL。

## Goals / Non-Goals

**Goals:**
- 建立 `skills/add-to-catalog/SKILL.md`，Agent 可以透過此 SKILL 讀元件原始碼並走完整個 pipeline
- SKILL 需涵蓋整個流程，Agent 不需要額外的人工介入

**Non-Goals:**
- 不修改現有 catalog 元件
- 不自動化 catalog 元件的測試撰寫
- 不支援一次新增多個元件

## Decisions

### 以 `box.tsx` 作為主要參考模板

`box.tsx` 是最簡單的自訂元件，只有 props 映射，沒有複雜的副作用或 iframe 邏輯。Agent 閱讀它可以快速理解 `XxxApi + XxxImpl` 的最小化結構。

`sandbox.tsx` 有 iframe、postMessage、ResizeObserver 等複雜邏輯，不適合作為一般元件的模板。

### SKILL 的輸入定義為「目標元件的路徑」

不要求使用者先整理 props 文件，而是讓 Agent 直接讀原始碼（例如 `src/components/ui/date-picker.tsx`）推導出 Zod schema。這降低了人類的準備成本，出錯時修正比從零寫容易。

### XxxApi schema 只映射有意義的 props

UI 元件的 props 可能有幾十個，但 catalog 的用途是讓 AI 驅動 UI，只需要映射對 AI 有語意的 props（例如 `value`、`label`、`onChange` 的回呼 ID 等）。內部實作細節（如 `ref`、`className` 中的具體 Tailwind class）可以省略或簡化。

### pipeline 步驟順序固定，不可跳過

`generate:refs` 依賴 `api-registry.ts` 已有 export，`sync:skill` 依賴 `generate:refs` 已執行完。步驟順序：寫元件 → 更新 registry → generate:refs → sync:skill。

## Risks / Trade-offs

[Risk] Agent 推導的 Zod `.describe()` 品質不穩定，可能描述不夠精確 → Mitigation：SKILL 指引 Agent 讀現有的 `box.tsx` 和 `sandbox.tsx` 作為 `.describe()` 風格範例，並在寫完後讓使用者確認 `references/Xxx.md` 的輸出是否符合預期

[Risk] `pnpm sync:skill` 的 glob 可能未涵蓋新 skill 目錄 `skills/add-to-catalog/` → Mitigation：建立 SKILL 時同時確認 `package.json` 的 sync:skill script，必要時更新 glob
