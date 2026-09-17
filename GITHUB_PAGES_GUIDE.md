# GitHub Pages 公開手順ガイド

本ドキュメントは、「FurimaPostCalc（メルカリ・フリマ専用：送料・梱包サイズ判定ツール）」を GitHub Pages でWeb上に公開するための手順書です。

> [!NOTE]
> 現在は**非公開状態**が維持されています。以下の手順を実行するまで、外部にWebサイトとして公開されることはありません。

---

## 🚀 公開手順（所要時間：約1分）

公開する準備が整ったら、以下の3ステップを行うだけで即座に公開できます。

### ステップ 1: GitHub リポジトリを開く
ブラウザで本プロジェクトの GitHub リポジトリを開きます：
`https://github.com/tk030-lotto/furima-post-calc`

### ステップ 2: Pages 設定画面へ移動
1. リポジトリ上部の **「Settings（設定）」** タブをクリックします。
2. 左サイドバーのメニューから **「Pages」** をクリックします。

### ステップ 3: デプロイ元を「GitHub Actions」に設定
1. **「Build and deployment」** セクションの **「Source」** ドロップダウンをクリックします。
2. 選択肢の中から **「GitHub Actions」** を選択します。

---

## ⏱️ 公開完了の確認

1. Source を「GitHub Actions」に切り替えると、リポジトリ内の `.github/workflows/deploy-pages.yml` が自動的に実行されます。
2. 約1〜2分後、Pages 画面の最上部に公開URLが表示されます：
   `https://tk030-lotto.github.io/furima-post-calc/`
3. このURLにアクセスすると、ブラウザ上でツールが即座に利用可能になります。

---

## ✨ 公開時に適用される機能

- **SNSシェア（OGP）自動反映**:
  - X（旧Twitter）、note、LINE等にURLを貼ると、専用サムネイル（`ogp.png` 1200×630）、タイトル、説明文がリッチカードとして自動表示されます。
- **ファビコン対応**:
  - ブラウザのタブに専用アイコン（`favicon.svg`）が表示されます。
- **自動テストランナーへのアクセス**:
  - `https://tk030-lotto.github.io/furima-post-calc/test.html` でブラウザテストも稼働します。
- **高速静的配信**:
  - `.nojekyll` により、Jekyllビルドの遅延やファイル除外なく、高速にキャッシュ配信されます。

---

## 🔒 いつでも非公開に戻す方法

公開を一時停止したい、または非公開に戻したい場合：
1. **Settings > Pages** を開きます。
2. ページ上部の「...」メニューから **「Unpublish site」** を選択すると、いつでも非公開に戻せます。
