## 1. 建立 SKILL 檔案

- [x] 1.1 在 `skills/add-to-catalog/` 目錄建立 `SKILL.md`，定義 SKILL 的 `name`、`description`（包含觸發關鍵字如「把元件加進 catalog」、「新增 catalog 元件」）
- [x] 1.2 在 SKILL.md 中寫入 Step 1：Agent 讀來源元件——說明 Agent 應讀目標元件路徑（例如 `src/components/ui/xxx.tsx`），以及讀 `src/catalog/components/box.tsx` 作為模板（對應「Agent reads source component to derive catalog schema」requirement）
- [x] 1.3 在 SKILL.md 中寫入 Step 2：Agent 推導 `XxxApi` schema——說明 Zod schema 的結構規範（只映射語意相關的 props、每個欄位加 `.describe()`、使用 `.strict()`），並說明找不到目標元件時應列出 `src/components/ui/` 候選清單讓使用者確認
- [x] 1.4 在 SKILL.md 中寫入 Step 3：Agent 寫入 catalog 元件檔——說明目標路徑 `src/catalog/components/<kebab-name>.tsx`，需同時 export `XxxApi` 和 `XxxImpl`，並說明檔案已存在時應詢問使用者是否覆蓋（對應「Agent writes catalog component file」requirement）
- [x] 1.5 在 SKILL.md 中寫入 Step 4：Agent 更新 `src/catalog/api-registry.ts`——說明在既有 export 區塊末尾加入 `export { XxxApi } from './components/<kebab-name>'`，並說明 export 已存在時跳過（對應「Agent updates api-registry」requirement）
- [x] 1.6 在 SKILL.md 中寫入 Step 5：執行 pipeline——依序執行 `pnpm generate:refs` 和 `pnpm sync:skill`，命令失敗時顯示錯誤並停止（對應「Agent executes post-update pipeline」requirement）
- [x] 1.7 在 SKILL.md 中加入設計決策說明：（a）以 `box.tsx` 作為主要參考模板，說明為何選擇它而非 sandbox.tsx；（b）SKILL 的輸入定義為「目標元件的路徑」，而非讓使用者手動描述 props；（c）XxxApi schema 只映射有意義的 props，省略純視覺或內部實作細節；（d）pipeline 步驟順序固定，不可跳過，每步驟完成才進行下一步

## 2. 確認 sync:skill 能涵蓋新 SKILL 目錄

- [x] [P] 2.1 確認 `package.json` 的 `sync:skill` script 的 glob 能涵蓋 `skills/add-to-catalog/`（目前 script 為 `cp -r skills/generate-ui/. .agents/skills/generate-ui/`，若只複製單一目錄需更新為通用 glob）
- [x] [P] 2.2 若 sync:skill script 需要更新，修改 `package.json` 使其同步所有 `skills/*/` 目錄到對應的 `.agents/skills/*/` 目錄
