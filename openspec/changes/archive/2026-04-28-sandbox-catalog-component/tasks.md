## 1. Sandbox 元件實作

- [x] 1.1 建立 `src/catalog/components/sandbox.tsx`，定義 `SandboxApi` schema（`source: z.string()`、`props: z.record(z.unknown()).optional()`）並建立空的 `SandboxImpl` 骨架；此元件即為「Sandbox component renders arbitrary React source in iframe」能力的入口，實作「iframe 作為沙箱隔離邊界（而非 `@babel/standalone` + `new Function`）」設計決策，以避免 React 雙實例問題
- [x] 1.2 實作「iframe 的 HTML shell 以 `srcdoc` 注入（而非獨立 HTML 檔案）」設計決策：包含 importmap（將 `react` 與 `react-dom/client` 對應至 `https://esm.sh/react@18` 與 `https://esm.sh/react-dom@18/client`）、`<div id="root">`，以及 bootstrap script（以 `URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))` 建立 blob URL 並動態 `import()`，將 default export 作為 React 元件掛載至 `#root`）
- [x] 1.3 在 `SandboxImpl` 中渲染 `<iframe>` 並套用 `sandbox="allow-scripts"` 屬性與 `srcdoc` prop；實作「props 透過 postMessage 傳遞」設計決策：iframe `load` 事件觸發後立即發送 `postMessage({ type: 'a2ui:props', payload: props })`，滿足「Props are passed to the sandboxed component via postMessage — Props delivered on mount」規格
- [x] 1.4 在 `SandboxImpl` 加入 `useEffect`，監聽 `props` 變更並重新發送 `postMessage({ type: 'a2ui:props', payload: props })` 至 iframe `contentWindow`，滿足「Props update propagated」規格
- [x] 1.5 實作「iframe 高度自適應」設計決策：在 `SandboxImpl` 加入 `useEffect` 監聽 `window message` 事件；收到 `{ type: 'a2ui:resize', height }` 時更新 iframe `height` 樣式；在 srcdoc bootstrap script 中加入 `ResizeObserver` 觀察 `#root` 元素並以 `window.parent.postMessage` 回傳高度，滿足「Sandbox iframe height auto-adjusts to content」規格
- [x] 1.6 在 srcdoc bootstrap script 中以 `try/catch` 包覆 blob URL import 並捕獲錯誤，在 `#root` 內渲染紅色錯誤覆蓋層顯示錯誤訊息；同時在 `SandboxImpl` 監聽 iframe `error` 事件作為雙重防護，滿足「Source syntax error shows error overlay」規格

## 2. Skill 文件更新

- [x] [P] 2.1 建立 `skills/generate-ui/references/Sandbox.md`，包含：元件名稱、props 表格（`source: string` 必填、`props: object` 選填）、使用時機說明、瀏覽器需求（Chrome 89+）、網路需求（esm.sh 需連線）、以及使用 chart.js 或 recharts 的完整 JSON 範例，滿足「AI agent skill documents Sandbox usage — Sandbox.md provides complete documentation」規格
- [x] [P] 2.2 更新 `skills/generate-ui/SKILL.md`，套用「SKILL.md 決策規則：catalog 優先，sandbox 為後備」：在 Component Reference 段落新增決策規則說明，指示 AI Agent 在 `references/` 中無對應元件文件時，使用 `Sandbox` 元件並在 `source` prop 填入完整 ESM 字串（含 `import` 宣告與 default export），滿足「SKILL.md references Sandbox decision rule」規格

## 3. 測試

- [x] 3.1 在 `src/catalog/components/__tests__/catalog-components.test.tsx` 新增測試，驗證 `customCatalog` 包含 name 為 `"Sandbox"` 的元件，並使 catalog 元件總數更新為 19，滿足「Provide shadcn-based component catalog」規格變更

## 4. Skill 同步與驗證

- [x] 4.1 執行 `pnpm sync:skill` 將 `skills/generate-ui/` 同步至 `.agents/skills/generate-ui/`（含新增的 `references/Sandbox.md`），確保 AI Agent 在 `.agents/skills/generate-ui/` 環境中能讀取最新文件
- [x] 4.2 執行 `pnpm test` 確認所有測試通過；啟動 `node .agents/skills/generate-ui/scripts/cli.cjs serve` 並手動以包含 `Sandbox` 元件的 `ui.json`（source 使用 recharts BarChart）驗證 iframe 渲染正確、高度自適應正常
