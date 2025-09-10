/**
 * メイン実行関数
 */

/**
 * スライドデータを生成する
 */
function createSlidePresentation(userText) {
  return generateSlideDataJSON(userText);
}

/**
 * テスト実行
 */
function runTest() {
  // まず設定をチェック
  checkConfig();
  
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
  
  try {
    const result = createSlidePresentation(testText);
    console.log('✅ 成功！生成されたスライド数:', result.slideData.length);
    return result;
  } catch (error) {
    console.error('❌ エラー:', error.message);
    throw error;
  }
}