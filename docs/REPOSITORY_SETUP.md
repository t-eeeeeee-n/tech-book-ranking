# リポジトリ設定ガイド / Repository Setup Guide

## PR #43 マージ後の必須設定

### 1. ブランチ保護設定 / Branch Protection Rules

GitHub Settings > Branches で `main` ブランチに以下を設定:

```yaml
Branch name pattern: main

Protection rules:
✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale PR approvals when new commits are pushed
  ✅ Require review from code owners

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  Required status checks:
    - Frontend CI (Node 18)
    - Frontend CI (Node 20)
    - Backend CI (Node 18)
    - Backend CI (Node 20)
    - Quality Gate

✅ Require conversation resolution before merging
✅ Require signed commits (recommended)
✅ Include administrators (recommended)
```

### 2. シークレット設定 / Secrets Configuration

Settings > Secrets and variables > Actions で追加:

| Name | Value | 説明 |
|------|-------|------|
| `CODECOV_TOKEN` | [Codecov Token] | カバレッジレポート用 |

**Codecov Token の取得手順:**
1. [Codecov](https://codecov.io/) にGitHubアカウントでログイン
2. リポジトリを追加: `t-eeeeeee-n/tech-book-ranking`
3. Settings > Repository Upload Token をコピー
4. GitHub Secrets に `CODECOV_TOKEN` として追加

### 3. CI 動作確認チェックリスト

PR #43 で以下を確認:
- [ ] Frontend CI (Node 18) が成功
- [ ] Frontend CI (Node 20) が成功
- [ ] Backend CI (Node 18) が成功
- [ ] Backend CI (Node 20) が成功
- [ ] Quality Gate が成功
- [ ] Docker Build Test が成功（main へのプッシュ時のみ）
- [ ] Codecov レポートが生成される

### 4. 開発ワークフロー確認

```bash
# 新機能開発の流れ
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 開発・テスト
npm run dev  # フロントエンド
npm run test # バックエンド

# プッシュ・PR作成
git add .
git commit -m "feat: new feature"
git push origin feature/new-feature

# GitHub で PR作成
# CI が全て成功することを確認
# レビューを受けてマージ
```

## CI パフォーマンス監視

### 目標指標
- **実行時間**: ≤ 5分
- **キャッシュヒット率**: ≥ 80%
- **成功率**: ≥ 95%

### 監視方法
1. Actions タブで実行時間を確認
2. キャッシュステップでヒット率を確認
3. 失敗した場合はログを詳細確認

## トラブルシューティング

### よくある問題と解決方法

**1. ESLint エラーが多数発生**
```bash
# 自動修正可能なエラーを修正
cd backend
npm run lint:fix

# 手動修正が必要なエラーを確認
npm run lint
```

**2. MongoDB 接続エラー**
- CI のMongoDB サービスが起動していない
- ヘルスチェック設定を確認

**3. Codecov アップロードエラー**
- `CODECOV_TOKEN` が設定されているか確認
- カバレッジファイル `backend/coverage/lcov.info` が生成されているか確認

**4. Docker ビルドエラー**
- `.env.example` ファイルが存在するか確認
- Dockerfile の構文エラーを確認

## 今後の拡張予定

### Phase 2: CD (継続的デプロイ)
- ステージング環境への自動デプロイ
- 本番環境への承認フロー付きデプロイ
- ロールバック機能

### Phase 3: 高度な監視
- パフォーマンステスト自動化
- セキュリティスキャン強化
- 依存関係の自動更新

## 参考リンク

- [CI Setup Documentation](./CI_SETUP.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Codecov Documentation](https://docs.codecov.com/)
- [PR #43](https://github.com/t-eeeeeee-n/tech-book-ranking/pull/43)
- [Issue #38](https://github.com/t-eeeeeee-n/tech-book-ranking/issues/38)