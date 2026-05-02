## 1. Schema 擴充

- [x] 1.1 在 `src/catalog/components/table.tsx` 中，將 `rows` 的 zod schema 從 `z.array(z.array(z.string()))` 改為 `z.array(z.array(z.union([z.string(), z.object({ id: z.string() })])))` — 滿足 **Table cell accepts component reference**

## 2. 渲染邏輯實作

- [x] 2.1 在 `TableImpl` 中，將 cell 渲染邏輯改為：若 cell 為 `{ id: string }` 物件則呼叫 `buildChild(id)`，否則渲染純字串 — 滿足 **Table cell accepts component reference**（String cell renders as text、Component ref cell renders the referenced component、Missing component ref renders empty cell、Mixed row with strings and component refs）

## 3. 文件更新

- [x] [P] 3.1 更新 `skills/generate-ui/references/Table.md`：在 Props 表格中更新 `rows` 說明，加入 cell component ref 格式（`string | { "id": string }`）及 JSON 範例
- [x] [P] 3.2 在 `skills/generate-ui/SKILL.md` 的 Table 相關說明或 Common Mistakes 區塊，補充 cell component ref 用法提示

## 4. Catalog 註冊確認

- [x] 4.1 確認 `src/catalog/api-registry.ts` 與 `src/catalog/index.ts` 的 Table 元件正確匯出更新後的 schema，確保 **Provide shadcn-based component catalog** 的元件清單維持完整（21 個元件）

## 5. 測試

- [x] 5.1 在 `src/catalog/components/__tests__/` 中新增或更新 Table 元件的測試，驗證 **Table cell accepts component reference** 的四個 scenario ：純字串 cell、component ref cell、不存在的 ref、混合 row
