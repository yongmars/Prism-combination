# プリズム合成計算

眼科で使用する2方向のプリズムをベクトル合成し、合成プリズム量と基底方向を表示するPWAです。

## 主な機能

- 右眼／左眼を選択したプリズム合成
- BU・BD・BI・BOまたは0〜360°の任意角度入力
- `Math.atan2`を用いた正しい象限の角度計算
- ベクトル図、直交成分、計算過程の表示
- 計算履歴と角度対応設定の端末内保存
- ホーム画面追加とオフライン起動

## 開発

```bash
npm install
npm run dev
```

## 確認

```bash
npm test
npm run build
```

## Vercel

Framework PresetはVite、Build Commandは`npm run build`、Output Directoryは`dist`を指定します。

本アプリは入力値の数学的な合成を行う計算補助ツールであり、医療判断や処方を行うものではありません。
