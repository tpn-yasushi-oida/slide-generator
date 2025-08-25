/**
 * まじん式スライドジェネレーター メイン処理
 * Gemini構造化出力を使用してslideDataを生成し、Googleスライドを作成
 */

// --- Webアプリのメイン関数 ---
function doGet() {
  var t = HtmlService.createTemplateFromFile("index");
  var html = t.evaluate();
  html.setTitle("SlideGenerator2");
  return html;
}

/**
 * おまかせ生成 - シンプルなテーマから自動でスライドを生成
 */
function mainAuto(prompt, generateOption) {
  try {
    Logger.log(`おまかせ生成開始: ${prompt}`);

    // おまかせ生成用のプロンプト拡張
    const expandedPrompt = expandAutoPrompt(prompt, generateOption);

    // Gemini APIでslideDataを生成
    const slideData = generateSlideDataWithGemini(
      expandedPrompt,
      getSlideDataSchema()
    );

    // スライドを生成
    const presentationUrl = generateSlideFromJson(slideData);

    Logger.log(`おまかせ生成完了: ${presentationUrl}`);
    return presentationUrl;
  } catch (error) {
    Logger.log(`おまかせ生成エラー: ${error.message}`);
    throw new Error(`スライド生成に失敗しました: ${error.message}`);
  }
}

/**
 * カスタム生成 - 詳細な内容から構造化されたスライドを生成
 */
function mainCustom(prompt, generateOption) {
  try {
    Logger.log(`カスタム生成開始: ${prompt}`);

    // カスタム生成用のプロンプト拡張
    const expandedPrompt = expandCustomPrompt(prompt, generateOption);

    // Gemini APIでslideDataを生成
    const slideData = generateSlideDataWithGemini(
      expandedPrompt,
      getSlideDataSchema()
    );

    // スライドを生成
    const presentationUrl = generateSlideFromJson(slideData);

    Logger.log(`カスタム生成完了: ${presentationUrl}`);
    return presentationUrl;
  } catch (error) {
    Logger.log(`カスタム生成エラー: ${error.message}`);
    throw new Error(`スライド生成に失敗しました: ${error.message}`);
  }
}

/**
 * おまかせ生成用のプロンプト拡張
 */
function expandAutoPrompt(prompt, generateOption) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  const systemPrompt = getGeminiPrompt();
  const userContent = `【おまかせ生成モード】
テーマ: ${prompt}

追加要望: ${generateOption || "なし"}

生成日: ${dateStr}

上記のテーマについて、以下の条件でプレゼンテーションを作成してください：
- 聞き手に分かりやすい構成
- 適切な情報量（5-15スライド程度）
- 視覚的に魅力的なレイアウト
- 実用的で具体的な内容
- スピーカーノート付き

テーマが簡潔な場合は、一般的で実用的な内容を補完して充実したプレゼンテーションを作成してください。`;

  return `${systemPrompt}

ユーザー入力:
${userContent}

上記の内容を解析して、slideDataのJSON配列を生成してください。`;
}

/**
 * カスタム生成用のプロンプト拡張
 */
function expandCustomPrompt(prompt, generateOption) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  const systemPrompt = getGeminiPrompt();
  const userContent = `【カスタム生成モード】
ユーザー提供内容:
${prompt}

追加要望・詳細設定: ${generateOption || "なし"}

生成日: ${dateStr}

上記の内容を分析し、最適な構造でプレゼンテーションを作成してください：
- 提供された内容を最大限活用
- 論理的で説得力のある流れ
- 適切なスライドタイプの選択
- 具体性と分かりやすさの両立
- 完全なスピーカーノート

内容が断片的な場合は、文脈を推測して一貫性のあるプレゼンテーションに構成してください。`;

  return `${systemPrompt}

ユーザー入力:
${userContent}

上記の内容を解析して、slideDataのJSON配列を生成してください。`;
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

    // スプレッドシートログ（オプション）
    // logToSpreadsheet(logData);
  } catch (error) {
    Logger.log(`ログ出力エラー: ${error.message}`);
  }
}

/**
 * HTMLテンプレート読み込み用のインクルード関数
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
