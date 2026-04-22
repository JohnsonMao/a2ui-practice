## Context

專案使用 `@a2ui/react` 的 `basicCatalog` 渲染 AI Agent 產生的 UI。`basicCatalog` 內部使用自有的 CSS-in-JS 樣式系統，與專案採用的 shadcn/ui（Tailwind CSS + CSS 變數 design token）完全獨立，導致 AI 產生的 UI 與應用程式的視覺設計無法整合。

`@a2ui/react/v0_9` 提供 `createComponentImplementation(api, RenderComponent)` 作為官方的元件覆寫擴充點，`Catalog` class 接受元件實作陣列，`MessageProcessor` 接受 catalog 陣列。這三者構成完整的自訂化路徑，無需 fork 任何函式庫。

## Goals / Non-Goals

**Goals:**

- 以 shadcn/ui 元件取代 `basicCatalog` 的 18 個元件渲染層
- 新的 `customCatalog` 的 id 設為 `"custom"`，`ui.json` 對應更新
- 不破壞 a2ui 的 prop schema 與訊息處理流程

**Non-Goals:**

- 不修改 `TextApi`、`ButtonApi` 等任何 ComponentApi schema
- 不新增 basicCatalog 未定義的元件
- 不改變 `useJsonPolling`、`MessageProcessor` 的行為
- 不支援 basicCatalog 的主題系統（themeSchema）

## Decisions

### 目錄結構：`src/catalog/` 集中管理

所有自訂 catalog 相關程式碼放在 `src/catalog/`：

```
src/catalog/
  index.ts              ← 匯出 customCatalog
  components/
    text.tsx
    button.tsx
    card.tsx
    ... (18 個元件)
```

**替代方案考慮**：放在 `src/components/catalog/` — 但 catalog 不是 UI 元件，是 a2ui 的整合層，獨立目錄更清楚。

### 每個元件用 `createComponentImplementation` 實作

```typescript
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { ButtonApi } from '@a2ui/web_core/src/v0_9/basic_catalog/components/basic_components'

export const CustomButton = createComponentImplementation(ButtonApi, ({ props }) => (
  <Button variant={props.style === 'primary' ? 'default' : 'outline'}>
    {props.label}
  </Button>
))
```

**理由**：prop schema 完全沿用 api 定義，不需要 Zod 重新定義，type-safe。

### Video / AudioPlayer 使用 HTML 原生元素

shadcn/ui 沒有對應元件，使用 `<video>` / `<audio>` 加 Tailwind 樣式即可，維持 API 相容。

### Catalog id 設為 `"custom"`

新 catalog 使用獨立 id `"custom"`，`ui.json` 的 `catalogId` 一併更新。不偽裝成舊 id，讓意圖透明。

## Risks / Trade-offs

- **[風險] prop 型別映射不完整** → a2ui prop schema 的某些欄位（如 `weight`、`accessibility`）需要在渲染層正確處理，否則靜默忽略。緩解：查看 `basic_components.d.ts` 中每個 Api 的完整 schema，確保必要欄位都有對應處理。
- **[風險] shadcn 元件安裝版本衝突** → 用 `pnpm dlx shadcn@latest add` 安裝前先確認 `components.json` 的 style 設定（目前為 `radix-nova`）。
- **[取捨] App.test.tsx mock** → 目前測試 mock 了 `basicCatalog`，換成 `customCatalog` 後 mock 需要同步更新，否則測試會失敗。

## Open Questions

（無）
