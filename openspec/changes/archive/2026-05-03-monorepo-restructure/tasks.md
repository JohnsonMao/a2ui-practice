## 1. Monorepo 基礎設定（使用 Turborepo 管理 build pipeline / example/ 放在 repo 根層而非 packages/ 內）

- [x] 1.1 在根層建立 `pnpm-workspace.yaml`，宣告 `packages: ['packages/*', 'example']`（example/ 放在 repo 根層而非 packages/ 內）
- [x] 1.2 在根層建立 `turbo.json`，定義 `build` pipeline（sdk → cli & app 並行，使用 Turborepo 管理 build pipeline），並設定 `lint`、`test`、`typecheck` tasks
- [x] 1.3 更新根層 `package.json`：移除 app 相關 dependencies、加入 `turbo` devDependency，更新 workspace-level scripts（`dev`、`build`、`test`、`typecheck`）

## 2. packages/sdk — SDK exports skill registration API / SDK package 以 @a2ui/web_core 為 peerDependency

- [x] [P] 2.1 建立 `packages/sdk/package.json`：`name: "@a2ui/sdk"`、`exports`（ESM + types）、SDK package 以 @a2ui/web_core 為 peerDependency（`peerDependencies: { "@a2ui/web_core": "*" }`）、`devDependencies: { "typescript" }`
- [x] [P] 2.2 建立 `packages/sdk/tsconfig.json`，繼承根層 tsconfig 並設定 `outDir: "./dist"`
- [x] [P] 2.3 建立 `packages/sdk/src/index.ts`，實作 SDK exports skill registration API：將 `src/catalog/skill.ts` 的 `a2ui.skill()`、`getRegistry()`、`SkillEntry` 複製過來，skill.ts provides a2ui.skill() registration function 維持不變，更新 import 路徑（`@a2ui/web_core/v0_9`）
- [x] 2.4 確認 SDK package is independently buildable：執行 `pnpm --filter @a2ui/sdk build` 並驗證 `packages/sdk/dist/index.js` 與 `index.d.ts` 存在

## 3. packages/cli — CLI serve 與 generate-refs 合併為同一個 bin / CLI 動態 import 使用者的 *.skill.ts

- [x] [P] 3.1 建立 `packages/cli/package.json`：`name: "@a2ui/cli"`、CLI is distributed as a single CJS bundle（`bin: { "a2ui": "./dist/cli.cjs" }`）、`dependencies: { "@a2ui/sdk": "workspace:*", "commander": "^12" }`
- [x] [P] 3.2 建立 `packages/cli/tsconfig.json` 與 `packages/cli/vite.config.ts`（CJS bundle，external: `http`、`fs`、`path`、`child_process`，target: `node18`）
- [x] 3.3 建立 `packages/cli/src/index.ts`：以 `commander` 設定主程式，CLI serve 與 generate-refs 合併為同一個 bin，加入 `serve` 與 `generate-refs` 兩個 subcommand；實作 CLI provides a2ui serve command：複製原 `cli/index.ts` 的 serve 邏輯至 `packages/cli/src/commands/serve.ts`，同時實作 CLI provides serve command 相容行為
- [x] 3.4 建立 `packages/cli/src/commands/generate-refs.ts`，實作 CLI provides a2ui generate-refs command：從 `scripts/generate-catalog-refs.ts` 移植邏輯，接受 `--dir` 與 `--out` flag，以 CLI 動態 import 使用者的 *.skill.ts 方式（dynamic import 副作用）掃描，再呼叫 `getRegistry()` from `@a2ui/sdk`
- [x] 3.5 確認 CLI is distributed as a single CJS bundle：執行 `pnpm --filter @a2ui/cli build` 驗證 `dist/cli.cjs` 存在且 `a2ui --help` 列出 `serve` 與 `generate-refs`

## 4. packages/app — Web App 搬移

- [x] [P] 4.1 建立 `packages/app/package.json`（private: true，依賴 `@a2ui/sdk`、`@a2ui/react`、`@a2ui/web_core` 及現有 app dependencies）
- [x] [P] 4.2 將 `src/` 搬移至 `packages/app/src/`，更新 `packages/app/tsconfig.json`、`packages/app/vite.config.ts`（路徑 alias `@` 指向 `./src`）
- [x] 4.3 更新 `packages/app/src/catalog/` 中所有 `*.skill.ts` 的 import：將 `../skill` 或 `../../catalog/skill` 改為 `@a2ui/sdk`
- [x] 4.4 確認 app 可獨立 build：執行 `pnpm --filter app build` 無錯誤

## 5. example — Example demonstrates standalone skill registration / Example can run generate-refs against its own skill files

- [x] [P] 5.1 建立 `example/package.json`（private: true，`name: "example"`，依賴 `@a2ui/sdk`、`@a2ui/web_core`，scripts: `generate-refs`，Example can run generate-refs against its own skill files）
- [x] [P] 5.2 建立 `example/src/button.skill.ts`：Example demonstrates standalone skill registration，示範從 `@a2ui/sdk` import `a2ui`、定義 Zod schema ComponentApi、呼叫 `a2ui.skill(api, { example })`
- [x] 5.3 確認 Example can run generate-refs against its own skill files：執行 `pnpm --filter example generate-refs` 並驗證 `example/references/` 下有 Markdown 輸出

## 6. 清理舊結構

- [x] 6.1 移除根層 `cli/` 目錄（已整合至 `packages/cli`）
- [x] 6.2 移除根層 `scripts/` 目錄（已整合至 `packages/cli`）
- [x] 6.3 移除 `src/catalog/skill.ts`（已移至 `packages/sdk`）
- [x] 6.4 移除根層 `vite.cli.config.ts`（已移至 `packages/cli`）
- [x] 6.5 更新 `skills/generate-ui/SKILL.md`：將 `node cli.cjs serve` 改為 `a2ui serve`、更新安裝說明

## 7. 整合驗證

- [x] 7.1 在根層執行 `pnpm build`（透過 Turborepo），確認 sdk → cli、app 依序 build 成功
- [x] 7.2 執行根層 `pnpm test` 確認所有既有測試通過（46 tests）
- [x] 7.3 執行根層 `pnpm typecheck` 確認全 workspace 無型別錯誤
