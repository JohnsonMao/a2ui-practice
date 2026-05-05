## Context

本專案以 `ui.json`（A2UI 協定）作為 AI Agent 驅動 UI 的中介格式，React App 輪詢並渲染。目前 Figma 設計稿、A2UI JSON 與產品程式碼三者各自獨立，設計師與開發者需手動轉譯，缺乏自動化橋接。

現有 CLI 提供 `serve`、`set`、`update`、`read`、`open` 等命令，由 AI Agent 透過 skill 呼叫。`serve` 僅支援 `GET /ui.json`，無法接收外部推送。UI 元件使用 shadcn/ui，已透過另一個專案以 Code Connect 綁定到 Figma 的 shadcn 組件層，Dev Mode 呈現的是 React JSX。

## Goals / Non-Goals

**Goals:**

- 建立 `figma-catalog-map` 共用套件，定義 Figma 元件 ↔ A2UI catalog 的雙向對應
- CLI 新增 `pull-figma`：Figma API → ui.json（開發者 / AI Agent 觸發）
- `serve` 新增 `POST /ui.json`：讓 Figma Plugin 可推送資料到本地預覽
- 建立 Figma Plugin（`packages/figma-plugin`）：雙向同步「Push to Preview」/ 「Pull from Preview」

**Non-Goals:**

- 不修改現有 Code Connect 設定（shadcn 層的 React Dev Mode 保持不變）
- 不支援 Figma 以外的設計工具
- Figma Plugin 不處理 CSS Variables / Token 同步（Token 同步透過另外的工具如 Token Studio 完成）

## Decisions

### Component Map 以獨立 package 存放，由 Plugin 與 CLI 共用

**決定**：建立 `packages/figma-catalog-map`，匯出 `catalogFigmaMap`，記錄每個 A2UI 組件的 Figma component key、prop 對應、以及 layout 原語映射（Column/Row → Auto Layout）。

**理由**：Plugin（瀏覽器環境）與 CLI `pull-figma`（Node.js）都需要這份 mapping。放在獨立 package 可讓兩者引用同一份資料，避免同步問題。

**替代方案**：嵌入 `.skill.ts` 檔案 — 但 `.skill.ts` 是 AI Agent 用途，混入 Figma metadata 會污染職責邊界。

---

### `serve` 新增 POST /ui.json 而非另開一個 port

**決定**：在現有 `serve` 的 HTTP server 上加 `POST /ui.json` 路由，接受 JSON body 後寫檔覆蓋，讓 React App 的 polling 機制自動觸發更新。

**理由**：Figma Plugin 的 iframe 可直接 `fetch('http://localhost:5173/ui.json', { method: 'POST', body })` 而無需配置額外 port 或 WebSocket。現有架構最小改動，不影響 AI Agent 的寫檔路徑。

**替代方案**：WebSocket / SSE — 雙向即時性過度設計，polling 2s 的延遲對設計師預覽已足夠。

---

### Figma Plugin 使用 manifest v2，UI 以 React + Vite 建構

**決定**：Plugin 放在 `packages/figma-plugin`，使用標準 Figma Plugin manifest v2 結構，UI frame 以 React + Vite 建構（與 monorepo 一致），透過 `postMessage` 與 plugin sandbox 通訊。

**理由**：monorepo 已使用 React + Vite + TypeScript，複用工具鏈降低維護成本；manifest v2 是目前 Figma 的主流標準。

## Risks / Trade-offs

- **Figma API 存取需要 Personal Access Token** → 由使用者透過環境變數 `FIGMA_TOKEN` 提供，CLI 文件說明；Plugin 側在 plugin 本地儲存
- **Component Map 需人工維護** → Figma 組件改名或 key 更換時 mapping 會失效。Mitigation：在 `pull-figma` 執行時若 mapping 找不到對應組件，輸出警告並跳過該節點，不中斷流程
- **`POST /ui.json` 無驗證** → 任何本地程序都能覆蓋預覽內容。Mitigation：僅限 localhost，serve 指令的定位是開發工具，不暴露到生產環境
