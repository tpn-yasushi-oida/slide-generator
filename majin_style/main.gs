/**
 * まじん式スライドジェネレーター メイン処理
 * 「スライド生成」専用。Gemini の構造化出力で JSON を生成し、スライド化します。
 * フロー:
 *  1) callGemini.generateSlideDataWithGemini() で構造化JSON (slideData) を生成
 *  2) majin_slide_generator.generateSlideFromJson() で Google スライドに変換
 * original_gem_prompt.md のステップ/パターン選定方針に沿うように、
 * ユーザープロンプトへパターン選定のガイダンスを付与し、必要時に一度だけ再生成を試みます。
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
    Logger.log(`スライド生成開始`);

    // 1) ユーザー入力を整形し、パターン選定ガイダンスと検出ヒントを付与
    const expandedPrompt = buildUserPromptWithGuidance(prompt, generateOption);

    // 2) Gemini 構造化出力で slideData(JSON配列) を生成
    let aiOutput = generateSlideDataWithGemini(expandedPrompt);
    // 互換: 配列のみ or { slideData, patternPlan }
    let slideData = Array.isArray(aiOutput) ? aiOutput : (aiOutput && aiOutput.slideData) ? aiOutput.slideData : [];
    let patternPlan = Array.isArray(aiOutput) ? null : (aiOutput && aiOutput.patternPlan) ? aiOutput.patternPlan : null;

    // 3) 最低限の妥当性を検証し、必要に応じて 1 回だけ再生成（パターン選定の強化）
    const patternHints = analyzePatternNeeds(prompt);
    const diversityNeeded = patternHints.expectedTypes && patternHints.expectedTypes.length > 0;
    const onlyContent = Array.isArray(slideData) && slideData.length > 0 && slideData.every(s => s && s.type === 'content');
    if (diversityNeeded && onlyContent) {
      Logger.log('パターン多様性不足を検出。再生成を 1 回試行します。');
      const retryPrompt = expandedPrompt +
        "\n\n【再生成指示（厳守）】\n" +
        "- ‘サポート済み表現パターン’から、期待パターンを最低1つ以上含めること。\n" +
        "- content に過度に偏らず、比較は compare、手順は process、時系列は timeline、表は table、図解は diagram、カードは cards、進捗は progress を使うこと。\n" +
        `- 期待パターン候補: ${patternHints.expectedTypes.join(', ')}\n` +
        "- 必須: content スライドには必ず points 配列(3-7)を含めること。その他パターンはスキーマに沿って生成。";
      aiOutput = generateSlideDataWithGemini(retryPrompt);
      slideData = Array.isArray(aiOutput) ? aiOutput : (aiOutput && aiOutput.slideData) ? aiOutput.slideData : [];
      patternPlan = Array.isArray(aiOutput) ? null : (aiOutput && aiOutput.patternPlan) ? aiOutput.patternPlan : null;
    }

    // 4) Google スライドに変換（patternPlanも渡せるように拡張）
    const payload = patternPlan ? { patternPlan: patternPlan, slideData: slideData } : slideData;
    const presentationUrl = generateSlideFromJson(payload);

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
function buildUserPromptWithGuidance(prompt, generateOption) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  // 入力と追加要望
  let userContent = `【入力テキスト】\n${prompt}\n\n` +
                    `【追加要望】${generateOption || "なし"}\n` +
                    `【生成日】${dateStr}`;

  // original_gem_prompt.md の「ステップ2: パターン選定」の方針を要約し、
  // “サポート済み表現パターン” を明示。Gemini 側のシステムプロンプト(getGeminiPrompt)と併用。
  const guidance =
    "\n\n【ステップ2: パターン選定ガイダンス（厳守）】\n" +
    "- 章・節ごとにサポート済み表現パターンから最適なものを選定すること。\n" +
    "- 種類: title / section / content / compare / process / timeline / diagram / cards / table / progress / closing\n" +
    "- ヒューリスティック: \n" +
    "  ・二項対立・長所短所・メリデメ・vs → compare\n" +
    "  ・手順・工程・HowTo・ステップ → process\n" +
    "  ・時系列・日付・スケジュール・ロードマップ → timeline\n" +
    "  ・相関・構造・アーキテクチャ・関係図 → diagram\n" +
    "  ・カード/特徴一覧・カテゴリ分け → cards\n" +
    "  ・一覧・表形式・指標/数値の行列 → table\n" +
    "  ・達成率・進捗・割合・% → progress\n" +
    "- content スライドは箇条書き(points: 3-7)を必須。\n" +
    "- アジェンダ系(titleが『アジェンダ/Agenda/本日の流れ』等)で points が空なら、以降の section.title から自動生成する。";

  // 入力のキーワードから期待パターン候補を抽出し、期待を明示
  const hints = analyzePatternNeeds(prompt);
  if (hints.expectedTypes && hints.expectedTypes.length > 0) {
    userContent += guidance +
                   "\n\n【期待パターン候補】\n- " + hints.expectedTypes.join(", ") +
                   "\n（必ずしも全てを使う必要はないが、content に偏らないこと）";
  } else {
    userContent += guidance;
  }

  // 生成ロジック自体は callGemini.getGeminiPrompt() にて指示
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

/**
 * 入力テキストから、パターン選定のヒント（期待パターン）を抽出
 * original_gem_prompt.md の「サポート済み表現パターン」に対応
 */
function analyzePatternNeeds(text) {
  const t = (text || '').toLowerCase();
  const expected = new Set();

  // 比較/対比
  if (/比較|対比|メリット|デメリット|長所|短所|\bvs\b|メリデメ/.test(text || '')) {
    expected.add('compare');
  }
  // 手順/工程
  if (/手順|工程|ステップ|process|プロセス|やり方|方法|流れ/.test(text || '')) {
    expected.add('process');
  }
  // 時系列/スケジュール
  if (/時系列|タイムライン|schedule|スケジュール|ロードマップ|timeline|計画|年|月|四半期|q[1-4]/i.test(text || '')) {
    expected.add('timeline');
  }
  // 図解/構造/相関
  if (/相関|関係図|アーキテクチャ|構造|仕組み|関係性|diagram/.test(text || '')) {
    expected.add('diagram');
  }
  // カード/特徴一覧
  if (/カード|特徴|ポイント一覧|カテゴリ|分類|cards/.test(text || '')) {
    expected.add('cards');
  }
  // 表形式
  if (/表|一覧表|表形式|テーブル|table/.test(text || '')) {
    expected.add('table');
  }
  // 進捗/割合
  if (/進捗|達成率|割合|％|%|バー|progress/.test(text || '')) {
    expected.add('progress');
  }

  return { expectedTypes: Array.from(expected) };
}
