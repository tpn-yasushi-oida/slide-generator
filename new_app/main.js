/**
 * Geminiの構造化出力でスライドデータを生成し、サンプル構造にクリーンアップ
 */
function generateSlideData(userInput) {
  const raw = requestGemini(userInput);
  const slideData = validateAndNormalizeSlideData(raw);
  console.log(JSON.stringify(slideData, null, 2));
  const slideUrl = generatePresentation(slideData)
  console.log(slideUrl)
  return slideUrl;
}

