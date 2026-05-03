## Context

專案原本將 React app（`src/`）、CLI 工具（`cli/`）、腳本（`scripts/`）、skill registry（`src/catalog/skill.ts`）全部混在 repo 根層。skill registry 與 app 耦合，導致無法在不依賴整個 app 的情況下實作自己的 UI 註冊流程。

`@a2ui/web_core/v0_9` 提供 `ComponentApi` 與 `InferredComponentApiSchemaType` 作為 skill 定義的型別基礎；`jiti` 可在 Node.js 執行時直接 import `.ts` 檔案而不需預先編譯，是 CLI 動態載入使用者 skill 檔案的關鍵。

## Goals / Non-Goals

**Goals:**

- 將 skill registration API 抽離為獨立套件 `@a2ui/sdk`，以 `@a2ui/web_core` 為 peerDependency
- 整合 `cli/` 與 `scripts/` 為單一 `@a2ui/cli` 套件，bin 名稱為 `a2ui`
- 任何人只需安裝 `@a2ui/sdk` 即可實作自己的 skill，不需引用 `app` 套件
- `example/` 完全獨立示範上述流程

**Non-Goals:**

- 不發佈至 npm registry
- 不修改 `@a2ui/web_core` 或 `@a2ui/react` 的任何 API
- 不改變 app 的 UI 渲染行為

## Decisions

### 套件拆分：四個 workspace 套件

```
packages/
  sdk/     @a2ui/sdk      — skill registry (tsc build, peerDep: @a2ui/web_core)
  cli/     @a2ui/cli      — a2ui CLI (vite CJS bundle, dep: @a2ui/sdk, jiti)
  app/     app            — React app (vite build, dep: @a2ui/sdk)
example/                  — 解耦示範 (dep: @a2ui/sdk)
```

**替代方案考慮**：`example/` 放在 `packages/example/` — 但 `example` 語意上是示範專案，不是可安裝套件，放根層更直觀，且 `pnpm-workspace.yaml` 明確宣告 `example` 也方便管理。

### SDK build：tsc 而非 Vite

SDK 是純 TypeScript 函式庫，需要 `.d.ts` 產出（`declaration: true`），tsc 直接輸出比 Vite 的 lib mode 更乾淨，且不需要 bundler 的額外設定。

### CLI build：Vite CJS bundle + `ssr: true`

CLI 需要打包成單一 `.cjs` 以便執行，選用 Vite 的 SSR 模式（`ssr: true`）而非 lib mode，原因：
- lib mode 在處理 `node:events`、`node:process` 等 Node 內建模組時會錯誤地視為 browser 模組
- SSR 模式正確 externalize 所有 node builtins
- `rollupOptions.output.entryFileNames: 'cli.cjs'` 確保輸出檔名

**jiti** 設為 external，不打包進 bundle（在使用者環境中以 npm dep 安裝）。

### CLI 動態 import `.ts`：jiti

原本 Node.js 無法直接 `import()` `.ts` 檔案。使用 `createJiti(pathToFileURL(process.cwd()).href)` 建立 jiti 實例，再呼叫 `jiti.import(filePath)` 載入使用者的 `*.skill.ts`，不需要使用者預先編譯。

**替代方案考慮**：`tsx`、`ts-node` — 都需要更複雜的 loader 設定或 fork process，jiti v2 更輕量。

### peerDependency 模型

`@a2ui/sdk` 將 `@a2ui/web_core` 設為 peerDependency，原因：
- `ComponentApi`、`InferredComponentApiSchemaType` 型別來自 `@a2ui/web_core`
- 使用者的 app 本來就會安裝 `@a2ui/web_core`，避免版本衝突與重複安裝
- SDK devDependency 保留以供本地開發

### Turborepo pipeline

```json
build: { dependsOn: ["^build"] }   // sdk 先 build，cli/app 才能 build
test, typecheck, lint               // 各自獨立
```

## Risks / Trade-offs

- **[風險] jiti 版本相容性** → jiti v2 的 `createJiti` API 與 v1 不同；已鎖定 `^2.6.1`，並確認 `jiti.import()` 在 Node 20 下正常運作。
- **[風險] pnpm install 在有 peer dep 警告時返回非零 exit code** → 以 `strict-peer-dependencies=false`（`.npmrc`）或分開執行 install 與 build 解決。
- **[取捨] CLI 無 watch mode** → `a2ui generate-refs` 每次需手動執行；符合目前的使用模式（AI agent 呼叫），不需 watch。
- **[取捨] example/ 無 build script** → example 只有 `generate-refs` script，不 build；Turborepo 的 `build` pipeline 不包含 example，刻意不強制要求。

## Open Questions

（無）
