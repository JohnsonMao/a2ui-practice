## Why

專案的原始碼、CLI 工具、腳本全混在 repo 根層，導致：
- `src/` 是 React app 原始碼，但 `cli/`、`scripts/` 是 Node.js 工具，關注點不同卻平行放置
- CLI 以 `node cli.cjs` 方式使用，無法以套件形式安裝或透過 `npx` 執行
- skill registry（`src/catalog/skill.ts`）與 app 實作耦合，任何人要實作自己的 UI 都必須複製整個 `src/`
- 沒有示範「完全解耦的 skill registration」的範例

## What Changes

- 以 pnpm workspaces + Turborepo 重組為 monorepo，拆分為四個套件：
  - `packages/sdk`（`@a2ui/sdk`）— skill registration API（`a2ui.skill()`、`getRegistry()`）
  - `packages/cli`（`@a2ui/cli`）— `a2ui serve` 與 `a2ui generate-refs` 整合成單一 CLI bin
  - `packages/app`（`app`）— 原 `src/` React app，依賴 `@a2ui/sdk`
  - `example/` — 完全解耦示範，任何人可自訂 `ComponentApi` 並呼叫 `a2ui generate-refs`
- 移除根層 `cli/`、`scripts/`、`vite.cli.config.ts`、`src/`（搬至 `packages/app/src/`）
- CLI 動態 import `*.skill.ts` 改用 `jiti`，支援不需預先編譯的 TypeScript 直接執行

## Non-Goals

- 不修改 `@a2ui/web_core` 或 `@a2ui/react` 的任何行為
- 不發佈 `@a2ui/sdk` 或 `@a2ui/cli` 至 npm（目前為 workspace 內部套件）
- 不改變 `app` 現有的 UI 渲染邏輯或元件 schema

## Capabilities

### New Capabilities

- `a2ui-sdk`: 獨立套件，提供 `a2ui.skill()` skill registration API，以 `@a2ui/web_core` 為 peerDependency
- `a2ui-cli`: 整合 CLI，提供 `a2ui serve`（靜態伺服器）與 `a2ui generate-refs`（Markdown ref 產生）

### Modified Capabilities

- `generate-ui-cli`: CLI 入口改為 `a2ui serve`（原為 `node scripts/cli.cjs serve`）
- `catalog-skill-connect`: skill 檔案改從 `@a2ui/sdk` import（原為 `@/catalog/skill`）

## Impact

- Affected specs: `a2ui-sdk`（新增）、`a2ui-cli`（新增）、`generate-ui-cli`（修改）、`catalog-skill-connect`（修改）
- Affected code:
  - 根層 `package.json` — 移除 app deps，加入 `turbo`
  - 新增 `pnpm-workspace.yaml`、`turbo.json`
  - `packages/sdk/src/index.ts` — skill registry 核心
  - `packages/cli/src/commands/` — serve + generate-refs
  - `packages/app/src/catalog/components/*.skill.ts` — 更新 import
  - `example/src/button.skill.ts` — 解耦示範
  - `skills/generate-ui/SKILL.md` — 更新 serve 指令
