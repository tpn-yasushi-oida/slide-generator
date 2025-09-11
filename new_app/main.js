/** ===================== main.gs ===================== */
/**
 * エンドポイント整理版
 * - testSlideGeneration: テスト用（手動実行）
 * - runGeneration: Web UI から呼ばれる本番用
 * 内部描画は renderSlides()（変数関数）経由で行い、Run メニューには出しません。
 */

function generateSlideData() {
  // slide_generator.js のトップレベルで参照されるため、function 宣言で提供する
  const testText = "次の入力から適切なスライド構成を作ってください。";

  try {
    const raw = requestGemini(testText);
    const slides = validateAndNormalizeSlideData(raw);
    console.log(JSON.stringify(slides, null, 2));
    return slides;
  } catch (e) {
    // フォールバック（ロード時失敗を防止）
    console.log("generateSlideData フォールバック発動:", e.message);
    const tz = (typeof Session !== 'undefined' && Session.getScriptTimeZone) ? Session.getScriptTimeZone() : "Asia/Tokyo";
    const today = (typeof Utilities !== 'undefined') ? Utilities.formatDate(new Date(), tz, "yyyy.MM.dd") : "2025.01.01";
    return [
      { type: "title", title: "Sample", date: today },
      { type: "closing", notes: "生成テスト(フォールバック)" }
    ];
  }
}

// 内部描画（Run メニューに出さない）
const renderSlides = (slideData) => {
  console.log("generateSlideFromJson: 開始");
  console.log("スライドデータ:", slideData);

  try {
    if (!Array.isArray(slideData)) {
      throw new Error("引数 slideData は配列である必要があります");
    }

    // 1. 新規プレゼンテーション作成
    const presentation = SlidesApp.create("AI Generated Presentation");
    const presentationUrl = presentation.getUrl();
    console.log("プレゼンテーション作成成功:", presentation.getId());

    // 2. ユーザー設定反映（slide_generator.js と同等）
    try {
      const userSettings = PropertiesService.getScriptProperties().getProperties();
      if (userSettings.primaryColor) CONFIG.COLORS.primary_color = userSettings.primaryColor;
      if (userSettings.footerText) CONFIG.FOOTER_TEXT = userSettings.footerText;
      if (userSettings.headerLogoUrl) CONFIG.LOGOS.header = userSettings.headerLogoUrl;
      if (userSettings.closingLogoUrl) CONFIG.LOGOS.closing = userSettings.closingLogoUrl;
      if (userSettings.fontFamily) CONFIG.FONTS.family = userSettings.fontFamily;
    } catch (e) {
      console.log("設定適用で警告:", e.message);
    }

    // 3. 既定で全スライド削除
    try {
      if (typeof SETTINGS !== "undefined" && SETTINGS.SHOULD_CLEAR_ALL_SLIDES) {
        const slides = presentation.getSlides();
        for (let i = slides.length - 1; i >= 0; i--) slides[i].remove();
      }
    } catch (e) { /* SETTINGS 未定義でも続行 */ }

    // 4. レイアウト生成
    const layout = createLayoutManager(presentation.getPageWidth(), presentation.getPageHeight());

    // 5. 各スライド描画
    let pageCounter = 0;
    for (const data of slideData) {
      try {
        const generator = (typeof slideGenerators !== 'undefined') ? slideGenerators[data.type] : null;
        if (data.type !== "title" && data.type !== "closing") pageCounter++;
        if (typeof generator === "function") {
          const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
          generator(slide, data, layout, pageCounter);

          if (data.notes) {
            try {
              const notesShape = slide.getNotesPage().getSpeakerNotesShape();
              if (notesShape) notesShape.getText().setText(data.notes);
            } catch (e) {
              console.log(`スピーカーノート設定に失敗: ${e.message}`);
            }
          }
        }
      } catch (e) {
        console.log(`スライド描画スキップ (エラー)。Type: ${data.type}, Title: ${data.title || "N/A"}, Error: ${e.message}`);
      }
    }

    console.log("スライド完成:", presentationUrl);
    return presentationUrl;

  } catch (error) {
    console.error("スライド生成エラー:", error);
    throw new Error(`スライド生成に失敗しました: ${error.message}`);
  }
};

/**
 * テスト用エンドポイント（手動実行）
 */
function testSlideGeneration() {
  const slideData = generateSlideData();
  return renderSlides(slideData);
}

/**
 * Web UI から呼ばれる本番用エンドポイント
 * @param {{prompt: string, generateOption?: string}} payload
 * @returns {{url: string}}
 */
function runGeneration(payload) {
  const prompt = payload && typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  const option = payload && typeof payload.generateOption === "string" ? payload.generateOption.trim() : "";
  if (!prompt) throw new Error("prompt が未入力です");

  const userInput = option ? `${prompt}\n\n[オプション]\n${option}` : prompt;
  const raw = requestGemini(userInput);
  const slides = validateAndNormalizeSlideData(raw);
  const url = renderSlides(slides);
  return { url };
}

