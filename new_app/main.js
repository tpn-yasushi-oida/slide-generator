/**
 * Geminiの構造化出力でスライドデータを生成する
 */
function generateSlideData() {
  const testText = `
新商品発表会

## 概要
来年度の新商品「スマートウォッチX1」を発表します。

## 特徴
- 7日間連続使用可能なバッテリー
- 防水性能IPX8対応
- 心拍数・血圧・血中酸素濃度の測定

## 価格
定価: 39,800円
  `;
  
  return requestGemini(testText);
}