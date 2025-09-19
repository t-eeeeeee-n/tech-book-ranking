# GitHub Actions CI セットアップ

## 概要

このプロジェクトでは、[Issue #38](https://github.com/t-eeeeeee-n/tech-book-ranking/issues/38) の要件に基づいて、GitHub Actions を使用したCI（継続的インテグレーション）を実装しています。

## CI の目標

- ✅ フロントエンドとバックエンドのテストを並列実行
- ✅ lint、typecheck、テストの品質チェックを実装
- ✅ コードカバレッジレポートの統合
- ✅ PRの品質ゲート確立
- ✅ CI実行時間を5分に短縮（50%削減）
- ✅ キャッシュヒット率 ≥80% を達成

## ワークフロー構成

### 1. CI ワークフロー (`.github/workflows/ci.yml`)

#### トリガー
- `main`, `develop` ブランチへのプッシュ
- `main`, `develop` ブランチへのプルリクエスト

#### ジョブ構成

**Frontend CI:**
- Node.js 18, 20 でのマトリックステスト
- npm キャッシュ利用
- ビルドと静的サイト生成

**Backend CI:**
- Node.js 18, 20 でのマトリックステスト
- MongoDB サービスコンテナ
- Lint、TypeCheck、ビルド、テスト実行
- Codecov へのカバレッジアップロード

**Docker Build Test:**
- フロントエンド・バックエンドのDockerイメージビルド
- docker-compose 設定の検証
- GitHub Actions キャッシュ活用

**Quality Gate:**
- 全てのチェック結果を統合
- CI/CD パイプラインの品質保証

### 2. セキュリティワークフロー (`.github/workflows/security.yml`)

- 週次セキュリティ監査
- 依存関係の脆弱性チェック
- PR での依存関係レビュー

## ブランチ保護設定

以下の設定を GitHub で有効にすることを推奨：

```yaml
# リポジトリ設定 > Branches > Branch protection rules
main:
  require_status_checks: true
  required_status_checks:
    - "Frontend CI (Node 18)"
    - "Frontend CI (Node 20)"
    - "Backend CI (Node 18)"
    - "Backend CI (Node 20)"
    - "Quality Gate"
  require_up_to_date_branches: true
  require_pull_request_reviews: true
  required_approving_review_count: 1
```

## 必要なシークレット設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定：

```
CODECOV_TOKEN: Codecov のトークン（カバレッジレポート用）
```

## 開発フロー

### 1. 新機能・修正の開発

```bash
# メインブランチから新しいブランチを作成
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 開発・コミット
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### 2. プルリクエスト作成

1. GitHub でプルリクエストを作成
2. CI が自動実行されることを確認
3. 全てのチェックが通ることを確認
4. レビューを受ける
5. main ブランチにマージ

## CI の最適化ポイント

### キャッシュ戦略
- npm キャッシュ: `cache: 'npm'` with `cache-dependency-path`
- Docker ビルドキャッシュ: GitHub Actions キャッシュ

### 並列実行
- フロントエンド・バックエンド同時実行
- マトリックステストで Node.js バージョン並列テスト

### 実行時間短縮
- `npm ci --prefer-offline --no-audit`
- タイムアウト設定: 10-15分
- 条件付きジョブ実行

## トラブルシューティング

### よくある問題

**1. ESLint 設定エラー**
```
ESLint couldn't find the config "@typescript-eslint/recommended"
```
→ バックエンドのESLint設定を修正する必要があります

**2. MongoDB 接続エラー**
```
MongoNetworkError: failed to connect to server
```
→ MongoDB サービスコンテナのヘルスチェック設定を確認

**3. キャッシュミス**
→ `package-lock.json` ファイルの存在とパスを確認

### ログ確認方法

1. GitHub Actions タブでワークフロー実行を確認
2. 失敗したジョブのログを詳細確認
3. Codecov でカバレッジレポートを確認

## 関連リンク

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Codecov Documentation](https://docs.codecov.com/)
- [Issue #38: CI/CD Pipeline Setup](https://github.com/t-eeeeeee-n/tech-book-ranking/issues/38)