/**
 * Geminiの構造化出力でスライドデータを生成し、サンプル構造にクリーンアップ
 * GAS環境用に修正済み
 */
function generateSlideData(userInput, options, generationMode) {
  try {
    const mode = generationMode === "enhanced" ? "enhanced" : "standard";
    const baseInput = typeof userInput === "string" ? userInput : "";
    const effectiveInput = mode === "enhanced"
      ? enhanceUserInput(baseInput)
      : baseInput;
    if (mode === "enhanced") {
      console.log("[ENHANCE] エンハンスモードでスライド生成を開始します。");
    }

    const safeOptions = options || {};
    const processedOptions = {
      primaryColor: safeOptions.primaryColor || "#145599",
      footerText: safeOptions.footerText || undefined,
      fontFamily: safeOptions.fontFamily || "Arial",
      // 空欄の場合はnullを設定（画像を配置しない）
      headerLogoUrl: safeOptions.headerLogoUrl || null,
      closingLogoUrl: safeOptions.closingLogoUrl || null
    };

    const prompt = getGeminiPrompt(effectiveInput);
    const rawSlideData = requestGeminiWithSchema(prompt);
    const cleanedJson = validateAndNormalizeSlideData(rawSlideData);
    const slideData = cleanedJson.slideData;
    const slideUrl = generatePresentation(slideData, processedOptions);

    return slideUrl;
  } catch (error) {
    // エラーメッセージを構築
    let errorMessage = "スライド生成中にエラーが発生しました。";

    if (error.message) {
      errorMessage += " エラー詳細: " + error.message;
    } else if (typeof error === "string") {
      errorMessage += " エラー詳細: " + error;
    }

    // エラーを再発生させてHTML側の失敗ハンドラーに渡す
    throw new Error(errorMessage);
  }
}
