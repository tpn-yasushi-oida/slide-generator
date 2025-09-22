/**
 * ユニットテスト
 */
function testGenerateJson() { 
    const prompt = getGeminiPrompt(mockUserInput)
    const raw = requestGemini(prompt);
    const cleaned = validateAndNormalizeSlideData(raw);
    console.log(JSON.stringify(cleaned, null, 2));
    return cleaned;
}

function testJson2Slide() { 
  const slideUrl = generatePresentation(mockSlideData, mockOptions) 
  console.log(slideUrl)
}

function testJson2SlideWithSetting() { 
  const slideUrl = generatePresentation(mockSlideData, mockOptions)
  console.log(slideUrl)
}

// function testMain() { 
//   const prompt = getGeminiPrompt(mockUserInput)
//   const raw = requestGemini(prompt);
//   const cleaned = validateAndNormalizeSlideData(raw);
//   const slideData = cleaned.slideData;
//   const slideUrl = generatePresentation(slideData) 
//   console.log(slideUrl)
// }

function testMain() { 
  generateSlideData(mockUserInput, mockOptions)
}


function testGenerateAllSlidePatterns(customOptions) {
    const options = customOptions || {};
    const processedOptions = {
        primaryColor: options.primaryColor || "#145599",
        footerText: options.footerText || "© TOPPAN Inc.",
        fontFamily: options.fontFamily || "Arial",
        headerLogoUrl: options.headerLogoUrl || null,
        closingLogoUrl: options.closingLogoUrl || null
    };

    const url = generateAllPatternPresentation(processedOptions);
    console.log(`[AllSlidePatterns] ${url}`);
    return url;
}

function testGenerateAllPatternSlides() {
  return testGenerateAllSlidePatterns(mockOptions);
}



function generateAllPatternPresentation(options) {
  const opts = options || {};
  const processedOptions = {
    primaryColor: opts.primaryColor || "#145599",
    footerText: opts.footerText || "© TOPPAN Inc.",
    fontFamily: opts.fontFamily || "Arial",
    headerLogoUrl: opts.headerLogoUrl || null,
    closingLogoUrl: opts.closingLogoUrl || null,
  };

  try {
    const sampleData = buildAllPatternSampleSlideData_();
    return generatePresentation(sampleData, processedOptions);
  } catch (error) {
    let errorMessage = "全パターンのスライド生成でエラーが発生しました。";
    if (error && error.message) {
      errorMessage += " 詳細: " + error.message;
    } else if (typeof error === "string") {
      errorMessage += " 詳細: " + error;
    }
    throw new Error(errorMessage);
  }
}

function buildAllPatternSampleSlideData_() {
  return [
    {
      type: "title",
      title: "スライドパターン一覧",
      date: "2025年9月13日",
      notes: "すべてのスライド生成パターンを確認できるデモ資料です。",
    },
    {
      type: "section",
      title: "イントロダクション",
      notes: "セクションスライドのサンプルです。",
    },
    {
      type: "content",
      title: "アジェンダ概要",
      subhead: "これから取り上げる主要トピック",
      points: [
        "パターン活用の意義",
        "レイアウト再利用の流れ",
        "次のアクション",
      ],
      notes: "標準的なコンテンツスライドの例です。",
    },
    {
      type: "statsCompare",
      title: "現状と目標の比較",
      subhead: "KPIのイメージ比較",
      leftTitle: "現状",
      rightTitle: "目標",
      stats: [
        { label: "サイクルタイム", leftValue: "12日", rightValue: "5日", trend: "down" },
        { label: "NPS", leftValue: "32", rightValue: "52", trend: "up" },
        { label: "単価", leftValue: "JPY 1.0k", rightValue: "JPY 0.7k", trend: "down" },
      ],
      notes: "指標比較スライドの例です。",
    },
    {
      type: "compare",
      title: "導入前後のワークフロー",
      subhead: "質的な違い",
      leftTitle: "導入前",
      rightTitle: "導入後",
      leftItems: [
        "手作業でのレビュー",
        "点在するフィードバック",
        "遅い改善サイクル",
      ],
      rightItems: [
        "AI支援によるレビュー",
        "コメントの一元管理",
        "週次リリース",
      ],
      notes: "比較スライドの例です。",
    },
    {
      type: "process",
      title: "導入ステップ",
      subhead: "3フェーズアプローチ",
      steps: [
        "ステークホルダーの合意形成",
        "パイロット開始",
        "手順書の展開",
      ],
      notes: "プロセススライドの例です。",
    },
    {
      type: "timeline",
      title: "四半期ロードマップ",
      subhead: "四半期ごとのマイルストーン",
      milestones: [
        { label: "キックオフ", date: "2025 Q1" },
        { label: "パイロット", date: "2025 Q2" },
        { label: "スケール", date: "2025 Q3" },
        { label: "最適化", date: "2025 Q4" },
      ],
      notes: "タイムラインスライドの例です。",
    },
    {
      type: "diagram",
      title: "サービスブループリント",
      subhead: "チーム横断連携の全体像",
      lanes: [
        { title: "発見", items: ["ニーズの収集", "ギャップの評価"] },
        { title: "設計", items: ["プロトタイプ作成", "レビューと改良"] },
        { title: "提供", items: ["リリース", "フィードバック監視"] },
      ],
      notes: "図解スライドの例です。",
    },
    {
      type: "cards",
      title: "ケイパビリティカード",
      subhead: "強みを一目で把握",
      items: [
        { title: "自動化", desc: "テンプレートからアクションを起動" },
        { title: "インサイト", desc: "利用状況をダッシュボードで可視化" },
        { title: "サポート", desc: "プロダクト内ヒントとガイダンス" },
      ],
      notes: "カード型スライドの例です。",
    },
    {
      type: "headerCards",
      title: "バリューストリーム",
      subhead: "テーマと概要",
      items: [
        { title: "発見", desc: "機会を素早く可視化" },
        { title: "意思決定", desc: "構造化プロンプトで判断を支援" },
        { title: "提供", desc: "ドキュメント出力を自動化" },
      ],
      notes: "ヘッダーカードスライドの例です。",
    },
    {
      type: "table",
      title: "ケイパビリティマトリクス",
      subhead: "チームごとの役割と責任",
      headers: ["チーム", "フォーカス", "担当者"],
      rows: [
        ["CX", "顧客体験オーケストレーション", "A. Watanabe"],
        ["営業", "アカウントプレイブック", "B. Suzuki"],
        ["運用", "自動化のガードレール", "C. Sato"],
      ],
      notes: "テーブルスライドの例です。",
    },
    {
      type: "progress",
      title: "準備状況",
      subhead: "ストリーム別の進捗",
      items: [
        { label: "ポリシー更新", percent: 80 },
        { label: "データマッピング", percent: 55 },
        { label: "イネーブルメント", percent: 40 },
      ],
      notes: "進捗スライドの例です。",
    },
    {
      type: "quote",
      title: "お客さまの声",
      subhead: "フィードバックハイライト",
      text: "パターンギャラリーのおかげで、数週間かかっていた再利用が数時間で可能になりました。",
      author: "プログラムリード",
      notes: "引用スライドの例です。",
    },
    {
      type: "kpi",
      title: "KPIダッシュボード",
      subhead: "主要指標",
      items: [
        { label: "週あたりの削減時間", value: "12時間", change: "直近スプリント比 +3時間", status: "good" },
        { label: "採用率", value: "68%", change: "+5pt", status: "good" },
        { label: "品質スコア", value: "4.3", change: "+0.7", status: "good" },
        { label: "エスカレーション件数", value: "2件", change: "前月比 -3", status: "good" },
      ],
      notes: "KPIスライドの例です。",
    },
    {
      type: "bulletCards",
      title: "主要プレイブック",
      subhead: "運用上のガイドライン",
      items: [
        { title: "キックオフ", desc: "スポンサーを揃えてKPIを定義" },
        { title: "パイロットスプリント", desc: "ガードレール付きでワークフローを検証" },
        { title: "スケールアップ", desc: "学びをテンプレートに定着" },
      ],
      notes: "箇条書きカードスライドの例です。",
    },
    {
      type: "faq",
      title: "FAQ",
      subhead: "よくある質問",
      items: [
        { q: "導入にはどれくらいの期間が必要ですか？", a: "標準設定で約2週間でオンボーディングが完了します。" },
        { q: "必要なデータは何ですか？", a: "既存のドキュメントとナレッジベースを活用します。" },
        { q: "生成物のガバナンスはどう担保しますか？", a: "リリース前に承認者が生成物をレビューします。" },
      ],
      notes: "FAQスライドの例です。",
    },
    {
      type: "closing",
      notes: "全パターンをご覧いただきありがとうございました。",
    },
  ];
}

