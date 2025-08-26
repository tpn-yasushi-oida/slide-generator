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
 * スライド生成（SPEC.md準拠）
 * @param {Object} form - フォームデータ（prompt, generateOptionなど）
 * @returns {Object} { presentationId, url }
 */
function runGeneration(form) {
  try {
    console.log("=== スライド生成メインプロセス開始 ===");
    console.log("📝 フォームデータ:", form);
    Logger.log(`スライド生成開始: ${JSON.stringify(form)}`);

    const expandedPrompt = buildTestPrompt(form.prompt, form.generateOption);
    console.log("🔄 展開済みプロンプト:", expandedPrompt);

    // 1) slideData（配列）を取得
    console.log("🤖 Gemini API呼び出し開始...");
    const data = generateSlideDataWithGemini(expandedPrompt);
    const slideData = typeof data === "string" ? JSON.parse(data) : data;
    
    console.log("✅ slideData生成完了");
    console.log("📊 slideData分析:", {
      スライド数: slideData.length,
      スライドタイプ: slideData.map(s => s.type),
      各スライド詳細: slideData.map((s, i) => ({
        index: i + 1,
        type: s.type,
        title: s.title || 'N/A',
        hasNotes: !!s.notes,
        hasPoints: !!s.points,
        pointsCount: Array.isArray(s.points) ? s.points.length : 0
      }))
    });

    // 2) 最低限のスキーマ検証
    console.log("🔍 slideDataの検証開始...");
    validateSlideData_(slideData);
    console.log("✅ slideData検証完了");

    // 3) スライド描画
    console.log("🎨 Google スライド生成開始...");
    const presentationUrl = generateSlideFromJson(slideData);
    
    // SPEC.mdに合わせた戻り値形式
    const result = {
      presentationId: extractPresentationIdFromUrl(presentationUrl),
      url: presentationUrl
    };
    
    console.log("✨ スライド生成完了!");
    console.log("🔗 結果:", result);
    Logger.log(`スライド生成完了: ${presentationUrl}`);
    return result;
  } catch (error) {
    console.error("💥 スライド生成エラー:", error);
    console.error("📋 エラー詳細:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    Logger.log(`スライド生成エラー: ${error.message}`);
    throw new Error(`スライド生成に失敗しました: ${error.message}`);
  }
}

/**
 * 後方互換性のための旧関数名エイリアス
 */
function mainTest(prompt, generateOption) {
  return runGeneration({ prompt, generateOption });
}

/**
 * slideDataの最低限の検証
 * @param {Array} arr - slideData配列
 */
function validateSlideData_(arr) {
  console.log("🔍 slideData検証開始:", arr);
  
  if (!Array.isArray(arr) || arr.length === 0) {
    console.error("❌ slideDataが空または配列ではありません:", arr);
    throw new Error("Invalid slideData: empty or not an array.");
  }
  
  arr.forEach((s, i) => {
    console.log(`📋 スライド ${i + 1} 検証:`, {
      type: s.type,
      hasTitle: !!s.title,
      hasRequiredFields: checkRequiredFields(s)
    });
    
    if (!s.type) {
      console.error(`❌ スライド ${i + 1}: typeが不足`, s);
      throw new Error(`slide[${i}]: missing type`);
    }
    
    if (s.type !== "closing" && !s.title) {
      console.error(`❌ スライド ${i + 1}: titleが不足`, s);
      throw new Error(`slide[${i}]: missing title`);
    }
    
    if (s.images && s.images.length > 6) {
      console.warn(`⚠️ スライド ${i + 1}: 画像数が上限を超過 (${s.images.length} > 6)`);
      throw new Error(`slide[${i}]: too many images (${s.images.length} > 6)`);
    }

    // contentスライドの特別な検証
    if (s.type === "content" && Array.isArray(s.points) && s.points.length === 0) {
      console.warn(`⚠️ スライド ${i + 1}: contentスライドのpoints配列が空です`);
    }
  });
  
  console.log("✅ slideData検証完了: すべてのスライドが有効です");
}

/**
 * スライドタイプ別の必須フィールドをチェック
 */
function checkRequiredFields(slide) {
  const requiredFields = {
    title: ['type', 'title'],
    section: ['type', 'title'],
    content: ['type', 'title'],
    compare: ['type', 'title', 'leftTitle', 'rightTitle', 'leftItems', 'rightItems'],
    process: ['type', 'title', 'steps'],
    timeline: ['type', 'title', 'milestones'],
    diagram: ['type', 'title', 'lanes'],
    cards: ['type', 'title', 'items'],
    table: ['type', 'title', 'headers', 'rows'],
    progress: ['type', 'title', 'items'],
    closing: ['type']
  };
  
  const required = requiredFields[slide.type] || ['type'];
  return required.every(field => slide.hasOwnProperty(field));
}

/**
 * URLからプレゼンテーションIDを抽出
 */
function extractPresentationIdFromUrl(url) {
  const match = url.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
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
