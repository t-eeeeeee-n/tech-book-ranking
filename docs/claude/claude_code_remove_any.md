# Claude Code 一発プロンプト v6（TypeScript `any` 撲滅｜非対話・自動適用→PR作成まで）

あなたは「TypeScript 型安全化アーキテクト 兼 CI ガード設計者」です。
目的：リポジトリ全体の `any` を検出→修正→検証→**PR作成**までを**非対話**で完了します。
人手承認は **PRレビュー** で行い、実行中の plan 承認は不要です（自動適用）。

---

## 実行パラメータ（必要なら変更）
```bash
REPO_PATH="./"
BRANCH_NAME="chore/typesafe-remove-any"
PR_TITLE="[chore] Remove explicit any and harden TS settings"
PR_LABELS="source/claude-code,type/refactor,area/backend,area/frontend,priority/medium"
REVIEWERS=""                # "alice,bob" のようにカンマ区切りで指定可（空なら未指定）
ASSIGNEES=""                # 任意
MAX_EDITS=200               # 1回で触るファイル上限
ALLOW_ANY_GLOBS=("**/node_modules/**" "**/dist/**" "**/.nuxt/**" "**/generated/**" "**/playwright-report/**" "**/*.d.ts" "**/fixtures/**" "**/*test*/**")
LINT_CMD="pnpm eslint ."
TYPECHECK_CMD="pnpm vue-tsc --noEmit && pnpm tsc -p tsconfig.json --noEmit"
TEST_CMD=""                 # 例: "pnpm vitest run --reporter=dot"（空ならスキップ）
FAIL_ON_NEW_ANY=true        # CIに導入するポリシー
AUTO_PUSH=true              # true で自動 push まで実施
BASE_BRANCH="main"          # 既定のベースブランチ
```

---

## ルール（必須）
- `any` は原則禁止。境界では `unknown` + スキーマ検証（zod/valibot）。
- 置換優先度：any → 具体型（DTO/ドメイン）＞ ジェネリック型引数 ＞ unknown+type-guard。
- `as any` 全廃、`@ts-expect-error` は理由コメント必須。
- 除外は `ALLOW_ANY_GLOBS` のみ。

---

## 手順（**非対話・自動適用**）
1) **ベースライン計測**
   - ripgrep で `: any` / `as any` / `<any>` を収集（除外グロブ適用）。
   - ESLint `@typescript-eslint/no-explicit-any` を dry-run。
   - 結果：総件数・ファイル別トップ10・種別（param/return/var/cast）。

2) **設計方針の自動推定**
   - 代表10箇所からパターン分類（API境界 / Mongoose / Pinia / 外部SDK / Utility）。

3) **安全ガードを適用**
   - tsconfig.json, ESLint強化、CI設定案を適用。

4) **自動修正（即時適用｜accept edits 相当）**
   - MAX_EDITS までの変更を直接適用。

5) **検証**
   - typecheck / lint / test を実行。失敗が出た場合は最小修正を2回まで自動適用。

6) **ブランチ作成・コミット・PR作成**
   - 新規ブランチ作成 → コミット分割 → push → PR作成。

7) **最終サマリを標準出力**
   - ベースライン件数 → 改善後件数、変更ファイル数、追加型／guard 数、CI 成否、PR URL。

---

## PR本文の必須構成
- 🎯 完了サマリ（ベースライン→改善後、件数、カテゴリ）
- 適用方針（エラーハンドリング、ジェネリック、API境界、Mongoose、Config）
- 設定強化（tsconfig, ESLint, CI）
- 検証結果（any削減率、lint/typecheck結果、zod.parse成功率）
- 次ステップ（未解決タスクやTODO）
- 確認コマンド例

---

## 受け入れ条件
- any出現数が90%以上削減または0件（除外グロブは除く）。
- ESLint違反0件。
- tsconfig: strict/noImplicitAny/noUncheckedIndexedAccess/exactOptionalPropertyTypes有効。
- zod.parseで代表API 3本以上が100%成功。
- CIでany再導入を検知してPRを落とす。

---

## 自動ハンドリング
- typecheck/lint/test失敗 → PRは作成し、未解決タスクとして本文に明記。
- 修正が大きすぎる場合はMAX_EDITS制限し、残りはTODOまたは追加Issueを作成。

---

## 実装例スニペット
### API（zod）
```ts
import { z } from 'zod';
export const QiitaItem = z.object({ id: z.string(), title: z.string(), url: z.string().url() });
export type QiitaItem = z.infer<typeof QiitaItem>;
export const parseQiita = (v: unknown) => QiitaItem.array().parse(v);
```

### Mongoose（lean + projection）
```ts
type BookLean = Pick<BookSchema, 'title'|'author'|'category'|'trendScore'|'mentionCount'>;
const rows: BookLean[] = await Book.find(q)
  .select('title author category trendScore mentionCount')
  .lean<BookLean>();
```

### Pinia（state 型）
```ts
interface Item { id: string; name: string }
export const useFoo = defineStore('foo', { state: (): { items: Item[] } => ({ items: [] }) });
```

---

## 実行フロー
1) ベースライン計測 → サマリ作成
2) 自動修正（MAX_EDITSまで）
3) typecheck / lint / test（失敗時は最小修正→再実行）
4) ブランチ作成・コミット・push
5) PR作成（本文にサマリ/確認コマンド/残タスクを記載、ラベル付与）
6) 実行結果を標準出力
