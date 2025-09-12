/**
 * Geminiの構造化出力でスライドデータを生成し、サンプル構造にクリーンアップ
 * GAS環境用に修正済み
 */
function generateSlideData(userInput, options) {
  try {
    const prompt = getGeminiPrompt(userInput);
    const rawSlideData = requestGemini(prompt);
    const slideData = validateAndNormalizeSlideData(rawSlideData);
    const slideUrl = generatePresentation(slideData, options);
    
    return slideUrl;
    
  } catch (error) {
    // エラーメッセージを構築
    let errorMessage = "スライド生成中にエラーが発生しました。";
    
    if (error.message) {
      errorMessage += " エラー詳細: " + error.message;
    } else if (typeof error === 'string') {
      errorMessage += " エラー詳細: " + error;
    }
    
    // エラーを再発生させてHTML側の失敗ハンドラーに渡す
    throw new Error(errorMessage);
  }
}