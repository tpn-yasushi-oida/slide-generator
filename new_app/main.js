/**
 * Geminiの構造化出力でスライドデータを生成し、サンプル構造にクリーンアップ
 * GAS環境用に修正済み
 */
function generateSlideData(userInput, options) {
  try {
    // オプションのデフォルト値設定と空欄処理
    const processedOptions = {
      primaryColor: options.primaryColor || "#145599",
      footerText: options.footerText || "© TOPPAN Inc.",
      fontFamily: options.fontFamily || "Arial",
      // 空欄の場合はnullを設定（画像を配置しない）
      headerLogoUrl: options.headerLogoUrl || null,
      closingLogoUrl: options.closingLogoUrl || null
    };

    const prompt = getGeminiPrompt(userInput);
    const rawSlideData = requestGemini(prompt);
    const cleanedJson = validateAndNormalizeSlideData(rawSlideData);
    const slideData = cleanedJson.slideData
    const slideUrl = generatePresentation(slideData, processedOptions);
    
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