## Why

新增元件到 catalog 目前需要手動執行 4 個步驟（寫 tsx、更新 registry、generate:refs、sync:skill），且每個步驟都有可能出錯。沒有一個 SKILL 把流程串起來，AI Agent 無法自主完成這件事。

## What Changes

- 新增 `skills/add-to-catalog/SKILL.md`，讓 AI Agent 能讀現有元件的原始碼，自動推導 Zod schema 並走完整個 pipeline
- SKILL 的 workflow 涵蓋：讀參考元件 → 推導 schema → 寫 catalog 元件檔 → 更新 api-registry → 執行 generate:refs → 執行 sync:skill

## Non-Goals

- 不修改現有元件的實作
- 不自動化測試撰寫（catalog 元件的單元測試仍由開發者手寫）
- 不支援批次新增多個元件（每次執行針對單一元件）

## Capabilities

### New Capabilities

- `add-to-catalog-skill`: AI Agent SKILL，讓 Agent 能讀 UI 元件原始碼並自動把它加進 catalog（包含 Api schema、Impl、registry 更新、Markdown 參考文件產生）

### Modified Capabilities

（無）

## Impact

- 新增檔案：`skills/add-to-catalog/SKILL.md`
- 同步目標：`.agents/skills/add-to-catalog/SKILL.md`（由 `pnpm sync:skill` 處理，需確認 sync script 的 glob 能涵蓋新 skill 目錄）
- 相關現有檔案（唯讀參考）：`src/catalog/components/box.tsx`、`src/catalog/api-registry.ts`、`scripts/generate-catalog-refs.ts`
