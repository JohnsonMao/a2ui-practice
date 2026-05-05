## Why

目前 Figma、A2UI 協定與產品程式碼三者各自獨立，設計稿無法直接驅動預覽或產生可用程式碼，開發者需要手動轉譯。建立雙向橋接層，以 `ui.json` 作為通用中介格式（IR），讓 Figma 設計稿與 A2UI 產生的結構可互相轉換，並進一步產生實際產品頁面程式碼。

## What Changes

- 新增 `packages/figma-catalog-map` 共用套件，定義 Figma 元件名稱/key 與 A2UI catalog 組件名稱及屬性的雙向對應
- 新增 CLI 命令 `a2ui pull-figma <url>`：透過 Figma API 讀取指定 frame，經 Component Map 轉換後寫入 `ui.json`，觸發 React 預覽
- `a2ui serve` 新增 `POST /ui.json` 端點，讓 Figma Plugin 可直接推送設計資料到本地預覽伺服器
- 新增 `packages/figma-plugin`：Figma Plugin，提供「Push to Preview」與「Pull from Preview」功能，設計師無需離開 Figma 即可觸發雙向同步

## Capabilities

### New Capabilities

- `figma-component-map`：定義 Figma 元件與 A2UI catalog 組件的雙向對應，為 Plugin 與 CLI 的共用詞彙表
- `figma-sync-plugin`：Figma Plugin，支援設計稿與 A2UI 預覽的雙向同步

### Modified Capabilities

- `a2ui-cli`：新增 `pull-figma` 命令；`serve` 命令新增 `POST /ui.json` 端點

## Impact

- Affected specs: `figma-component-map`（新）、`figma-sync-plugin`（新）、`a2ui-cli`（修改）
- Affected code:
  - `packages/cli/src/commands/serve.ts` — 新增 POST endpoint
  - `packages/cli/src/commands/pull-figma.ts` — 新增
  - `packages/cli/src/index.ts` — 註冊新命令
  - `packages/figma-catalog-map/` — 新套件
  - `packages/figma-plugin/` — 新套件
