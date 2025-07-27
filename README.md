# プロジェクト名

このプロジェクトは、モダンなWeb技術を使用して構築されたフルスタックWebアプリケーションです。

## 🚀 技術スタック

### フロントエンド
- **TypeScript** - 型安全性を提供する静的型付けJavaScript
- **React** - ユーザーインターフェース構築のためのJavaScriptライブラリ
- **Vite** - 高速な開発サーバーとビルドツール
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **Lucide React** - 美しいアイコンライブラリ

### 状態管理・データ取得
- **React Context API** - 認証状態のグローバル管理
- **TanStack Query** - サーバー状態管理とキャッシング
- **カスタムフック（useAuth等）** - ロジックの再利用性向上

### バリデーション
- **Zod** - TypeScript-firstなスキーマバリデーション

### バックエンド・インフラ
- **Supabase** - オープンソースのFirebase代替
  - 認証機能
  - PostgreSQLデータベース
  - ファイルストレージ
- **Node.js** - サーバーサイドJavaScript実行環境

### ホスティング・デプロイ
- **Vercel** - フロントエンドのホスティングプラットフォーム

## 📋 前提条件

- Node.js (v18以上推奨)
- npm または yarn
- Supabaseアカウント

## 🛠️ セットアップ

### 1. リポジトリのクローン
```bash
git clone [リポジトリURL]
cd [プロジェクト名]
```

### 2. 依存関係のインストール
```bash
npm install
# または
yarn install
```

### 3. 環境変数の設定
`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 開発サーバーの起動
```bash
npm run dev
# または
yarn dev
```

アプリケーションは `http://localhost:5173` で起動します。

## 📁 プロジェクト構成

```
src/
├── components/     # 再利用可能なUIコンポーネント
├── hooks/         # カスタムフック（useAuth等）
├── context/       # React Context（認証状態等）
├── lib/           # ユーティリティ関数・設定
├── pages/         # ページコンポーネント
├── types/         # TypeScript型定義
└── styles/        # スタイルファイル
```

## 🔧 利用可能なスクリプト

- `npm run dev` - 開発サーバーの起動
- `npm run build` - プロダクションビルドの作成
- `npm run preview` - ビルドしたアプリのプレビュー
- `npm run lint` - ESLintによるコード品質チェック

## 🚀 デプロイ

このプロジェクトはVercelでホスティングされています。

### Vercelへのデプロイ手順
1. Vercelアカウントにログイン
2. GitHubリポジトリと連携
3. 環境変数を設定

## 🔐 認証機能

Supabaseの認証機能を使用して、以下の機能を提供：
- ユーザー登録・ログイン
- パスワードリセット
- セッション管理

## 📝 開発のポイント

### 状態管理
- **認証状態**: React Context APIで管理
- **サーバー状態**: TanStack Queryでキャッシュと同期

### スタイリング
- Tailwind CSSのユーティリティクラスを使用

### 型安全性
- TypeScriptで静的型チェック
- Zodでランタイムバリデーション

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成
