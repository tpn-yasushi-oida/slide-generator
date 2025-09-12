/**
 * Geminiの構造化出力でスライドデータを生成し、サンプル構造にクリーンアップ
 */
function generateSlideData(userInput, options) {
  const prompt = getGeminiPrompt(userInput)
  const rawSlideData = requestGemini(prompt);
  const slideData = validateAndNormalizeSlideData(rawSlideData);
  // console.log(JSON.stringify(slideData, null, 2));
  const slideUrl = generatePresentation(slideData, options)
  console.log(slideUrl)
  return slideUrl;
}