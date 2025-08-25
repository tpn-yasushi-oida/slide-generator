/**
 * まじん式スライドジェネレーター メイン処理
 * 「スライド生成」専用。Gemini の構造化出力で JSON を生成し、スライド化します。
 */

// --- Web アプリのメイン関数 ---
function doGet() {
  var t = HtmlService.createTemplateFromFile("index");
  var html = t.evaluate();
  html.setTitle("SlideGenerator2");
  return html;
}

/**
 * スライド生成（単一路線）
 * - callGemini.gs の構造化出力で slideData(JSON) を生成
 * - majin_slide_generator.gs で Google スライドに変換
 */
function mainTest(prompt, generateOption) {
  try {
    Logger.log(`スライド生成開始: ${prompt}`);

    const expandedPrompt = buildTestPrompt(prompt, generateOption);

    // Gemini 構造化出力で slideData(JSON配列) を生成
    const slideData = generateSlideDataWithGemini(
      expandedPrompt,
      getSlideDataSchema()
    );

    // Google スライドに変換
    const presentationUrl = generateSlideFromJson(slideData);

    Logger.log(`スライド生成完了: ${presentationUrl}`);
    return presentationUrl;
  } catch (error) {
    Logger.log(`スライド生成エラー: ${error.message}`);
    throw new Error(`スライド生成に失敗しました: ${error.message}`);
  }
}

/**
 * スライド生成用のユーザープロンプト整形
 * システム側の指示は callGemini 側で一度だけ付与する前提。
 */
function buildTestPrompt(prompt, generateOption) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  const userContent =
    `【入力テキスト】\n${prompt}\n\n` +
    `【追加要望】${generateOption || "なし"}\n` +
    `【生成日】${dateStr}`;

  // 生成ロジックは callGemini.getGeminiPrompt() に集約
  return userContent;
}

/**
 * ログ出力関数
 */
function outputLog(prompt, generateOption, buttonId) {
  try {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp: timestamp,
      buttonId: buttonId,
      prompt: prompt,
      generateOption: generateOption,
      promptLength: prompt ? prompt.length : 0,
    };

    Logger.log(`ユーザーアクション: ${JSON.stringify(logData)}`);

    // スプレッドシート等にログを保存する場合は以下を使用
    // logToSpreadsheet(logData);
  } catch (error) {
    Logger.log(`ログ出力エラー: ${error.message}`);
  }
}

/**
 * HTML テンプレート読み込み用のインクルード関数
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
