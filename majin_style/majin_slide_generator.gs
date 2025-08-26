/**
 * @OnlyCurrentDoc
 * このスクリプトは、Google スライドを自動生成し、Google のデザインテーマに沿って整形します。
 * Version: 12.0 (Universal Google Design - Final)
 * Author: Google 生成AIチーム
 * Prompt Design: Gemini 担当
 * Description: 入力された slideData を元に、Google スライドを自動生成します。
 */

// --- 1. 設定 ---
const SETTINGS = {
  SHOULD_CLEAR_ALL_SLIDES: true,
  TARGET_PRESENTATION_ID: null
};

// --- 2. デザイン設定 (Google Design Ver.) ---
const CONFIG = {
  BASE_PX: { W: 960, H: 540 },
  
  // 全スライド共通
  POS_PX: {
    titleSlide: {
      logo:       { left: 55,  top: 105,  width: 135 },
      title:      { left: 50,  top: 230, width: 800, height: 90 },
      date:       { left: 50,  top: 340, width: 250, height: 40 },
    },
    
    // コンテンツスライド
    contentSlide: {
      headerLogo:     { right: 20, top: 20, width: 75 },
      title:          { left: 25, top: 60,  width: 830, height: 65 },
      titleUnderline: { left: 25, top: 128, width: 260, height: 4 },
      subhead:        { left: 25, top: 140, width: 830, height: 30 },
      body:           { left: 25, top: 172, width: 910, height: 303 },
      twoColLeft:     { left: 25,  top: 172, width: 440, height: 303 },
      twoColRight:    { left: 495, top: 172, width: 440, height: 303 }
    },
    compareSlide: {
      headerLogo:     { right: 20, top: 20, width: 75 },
      title:          { left: 25, top: 60,  width: 830, height: 65 },
      titleUnderline: { left: 25, top: 128, width: 260, height: 4 },
      subhead:        { left: 25, top: 140, width: 830, height: 30 },
      leftBox:        { left: 25,  top: 172, width: 430, height: 303 },
      rightBox:       { left: 505, top: 172, width: 430, height: 303 }
    },
    processSlide: {
      headerLogo:     { right: 20, top: 20, width: 75 },
      title:          { left: 25, top: 60,  width: 830, height: 65 },
      titleUnderline: { left: 25, top: 128, width: 260, height: 4 },
      subhead:        { left: 25, top: 140, width: 830, height: 30 },
      area:           { left: 25, top: 172, width: 910, height: 303 }
    },
    timelineSlide: {
      headerLogo:     { right: 20, top: 20, width: 75 },
      title:          { left: 25, top: 60,  width: 830, height: 65 },
      titleUnderline: { left: 25, top: 128, width: 260, height: 4 },
      subhead:        { left: 25, top: 140, width: 830, height: 30 },
      area:           { left: 25, top: 172, width: 910, height: 303 }
    },
    diagramSlide: {
      headerLogo:     { right: 20, top: 20, width: 75 },
      title:          { left: 25, top: 60,  width: 830, height: 65 },
      titleUnderline: { left: 25, top: 128, width: 260, height: 4 },
      subhead:        { left: 25, top: 140, width: 830, height: 30 },
      lanesArea:      { left: 25, top: 172, width: 910, height: 303 }
    },
    cardsSlide: {
      headerLogo:     { right: 20, top: 20, width: 75 },
      title:          { left: 25, top: 60,  width: 830, height: 65 },
      titleUnderline: { left: 25, top: 128, width: 260, height: 4 },
      subhead:        { left: 25, top: 140, width: 830, height: 30 },
      gridArea:       { left: 25, top: 172, width: 910, height: 303 }
    },
    tableSlide: {
      headerLogo:     { right: 20, top: 20, width: 75 },
      title:          { left: 25, top: 60,  width: 830, height: 65 },
      titleUnderline: { left: 25, top: 128, width: 260, height: 4 },
      subhead:        { left: 25, top: 140, width: 830, height: 30 },
      area:           { left: 25, top: 172, width: 910, height: 303 }
    },
    progressSlide: {
      headerLogo:     { right: 20, top: 20, width: 75 },
      title:          { left: 25, top: 60,  width: 830, height: 65 },
      titleUnderline: { left: 25, top: 128, width: 260, height: 4 },
      subhead:        { left: 25, top: 140, width: 830, height: 30 },
      area:           { left: 25, top: 172, width: 910, height: 303 }
    },
    
    // セクション区切り
    sectionSlide: {
      title:      { left: 55, top: 230, width: 840, height: 80 },
      ghostNum:   { left: 35, top: 120, width: 300, height: 200 }
    },
    
    footer: {
      leftText:  { left: 15, top: 505, width: 250, height: 20 },
      rightPage: { right: 15, top: 505, width: 50,  height: 20 }
    },
    bottomBar: { left: 0, top: 534, width: 960, height: 6 }
  },
  
  FONTS: {
    family: 'Arial',
    sizes: {
      title: 45,
      date: 16,
      sectionTitle: 38,
      contentTitle: 28,
      subhead: 18,
      body: 14,
      footer: 9,
      chip: 11,
      laneTitle: 13,
      small: 10,
      processStep: 14,
      axis: 12,
      ghostNum: 180
    }
  },
  COLORS: {
    primary_blue: '#4285F4',
    google_red: '#EA4335',
    google_yellow: '#FBBC04',
    google_green: '#34A853',
    text_primary: '#333333',
    background_white: '#FFFFFF',
    background_gray: '#f8f9fa',
    faint_gray: '#e8eaed',
    lane_title_bg: '#f5f5f3',
    lane_border: '#dadce0',
    card_bg: '#ffffff',
    card_border: '#dadce0',
    neutral_gray: '#9e9e9e',
    ghost_gray: '#efefed'
  },
  DIAGRAM: {
    laneGap_px: 24, lanePad_px: 10, laneTitle_h_px: 30,
    cardGap_px: 12, cardMin_h_px: 48, cardMax_h_px: 70,
    arrow_h_px: 10, arrowGap_px: 8
  },
  
  LOGOS: {
    header: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png',
    closing: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png'
  },
  
  FOOTER_TEXT: `© ${new Date().getFullYear()} Your Organization`
};

// --- 3. JSONデータからスライド生成の起点 ---
/**
 * JSON形式のslideDataを元にGoogleスライドを生成
 * @param {Object} slideDataJson - スライドデータを含むJSON
 * @returns {string} 生成されたプレゼンテーションのURL
 */
function generateSlideFromJson(slideDataJson) {
  Logger.log('generateSlideFromJson: 開始');
  try {
    // JSON文字列をパース
    const slideData = typeof slideDataJson === 'string' 
      ? JSON.parse(slideDataJson) 
      : slideDataJson;
    
    if (!Array.isArray(slideData)) {
      throw new Error('slideDataが配列ではありません。');
    }
    
    Logger.log(`generateSlideFromJson: スライドデータ解析完了 - ${slideData.length}枚のスライド`);
    const result = generatePresentationFromData(slideData);
    Logger.log(`generateSlideFromJson: 完了 - URL: ${result}`);
    return result;
  } catch (error) {
    Logger.log(`generateSlideFromJson: エラー - ${error.message}`);
    Logger.log(`Stack: ${error.stack}`);
    throw error;
  }
}

/**
 * テスト用の簡単なスライド生成関数
 * エラーの原因を特定するために使用
 */
function testSlideGeneration() {
  Logger.log('testSlideGeneration: テスト開始');
  try {
    const testData = [
      { 
        type: 'title', 
        title: 'テストプレゼンテーション', 
        date: '2024.01.01',
        notes: 'これはテスト用のタイトルスライドです。'
      },
      { 
        type: 'content', 
        title: 'テストコンテンツ',
        points: ['テスト項目1', 'テスト項目2', 'テスト項目3'],
        notes: 'これはテスト用のコンテンツスライドです。'
      },
      { 
        type: 'closing',
        notes: 'これはテスト用のクロージングスライドです。'
      }
    ];
    
    Logger.log('testSlideGeneration: テストデータ準備完了');
    const url = generatePresentationFromData(testData);
    Logger.log(`testSlideGeneration: 成功 - URL: ${url}`);
    return url;
  } catch (error) {
    Logger.log(`testSlideGeneration: エラー - ${error.message}`);
    Logger.log(`Stack: ${error.stack}`);
    throw error;
  }
}

// --- 4. メイン処理 ---
let __SECTION_COUNTER = 0; // セクション番号のカウンタ

function generatePresentationFromData(slideData) {
  let presentation;
  try {
    console.log("=== Google スライド生成開始 ===");
    console.log("📄 入力slideData:", slideData);
    console.log("📊 slideData概要:", {
      総数: slideData.length,
      タイプ別集計: slideData.reduce((acc, s) => {
        acc[s.type] = (acc[s.type] || 0) + 1;
        return acc;
      }, {})
    });

    // アジェンダ自動生成のためのグローバル変数設定
    _globalSlideData = slideData;
    console.log("🌐 グローバルslideData設定完了 (アジェンダ生成用)");

    presentation = SETTINGS.TARGET_PRESENTATION_ID
      ? SlidesApp.openById(SETTINGS.TARGET_PRESENTATION_ID)
      : SlidesApp.create('Generated Presentation');
    
    if (!presentation) throw new Error('プレゼンテーションを開けませんでした。');
    
    console.log("📁 プレゼンテーション作成完了:", presentation.getId());

    if (SETTINGS.SHOULD_CLEAR_ALL_SLIDES) {
      const slides = presentation.getSlides();
      console.log(`🗑️ 既存スライドを削除中... (${slides.length}枚)`);
      for (let i = slides.length - 1; i >= 0; i--) slides[i].remove();
    }
    
    __SECTION_COUNTER = 0;
    
    const layout = createLayoutManager(presentation.getPageWidth(), presentation.getPageHeight());
    console.log("📐 レイアウトマネージャー初期化完了:", {
      pageWidth: presentation.getPageWidth(),
      pageHeight: presentation.getPageHeight(),
      scaleX: layout.scaleX,
      scaleY: layout.scaleY
    });
    
    let pageCounter = 0;
    for (let i = 0; i < slideData.length; i++) {
      const data = slideData[i];
      console.log(`\n🔧 スライド ${i + 1}/${slideData.length} 生成開始`);
      console.log("📋 スライドデータ:", {
        type: data.type,
        title: data.title || 'N/A',
        hasSubhead: !!data.subhead,
        hasPoints: !!data.points,
        pointsCount: Array.isArray(data.points) ? data.points.length : 0,
        hasNotes: !!data.notes,
        hasImages: Array.isArray(data.images) && data.images.length > 0,
        otherProps: Object.keys(data).filter(k => !['type', 'title', 'subhead', 'points', 'notes', 'images'].includes(k))
      });

      Logger.log(`スライド生成開始: ${i + 1}/${slideData.length} - タイプ: ${data.type}, タイトル: ${data.title || 'N/A'}`);
      
      const generator = slideGenerators[data.type];
      if (data.type !== 'title' && data.type !== 'closing') pageCounter++;
      
      if (generator) {
        try {
          const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
          console.log(`✅ 空スライド作成完了: ${i + 1}`);
          Logger.log(`スライド作成完了: ${i + 1} - 生成関数実行中...`);
          
          console.log(`🎨 ${data.type} スライド生成中...`);
          generator(slide, data, layout, pageCounter);
          console.log(`✨ ${data.type} スライド生成完了: ${i + 1}`);
          Logger.log(`スライド生成成功: ${i + 1} - タイプ: ${data.type}`);
          
          // ノート（スピーカーノート）の追加
          if (data.notes) {
            try {
              console.log(`📝 スピーカーノート追加中: ${i + 1}`);
              const notesShape = slide.getNotesPage().getSpeakerNotesShape();
              if (notesShape) {
                notesShape.getText().setText(data.notes);
                console.log(`✅ スピーカーノート追加成功: ${i + 1}`);
                Logger.log(`ノート追加成功: ${i + 1}`);
              }
            } catch (e) {
              console.error(`❌ スピーカーノート追加失敗: ${i + 1}`, e);
              Logger.log(`ノート追加失敗: ${i + 1} - ${e.message}`);
            }
          }
        } catch (e) {
          console.error(`💥 スライド生成エラー: ${i + 1}`, {
            type: data.type,
            error: e,
            data: data
          });
          Logger.log(`スライド生成エラー: ${i + 1} - タイプ: ${data.type}`);
          Logger.log(`エラー詳細: ${e.message}`);
          Logger.log(`スタック: ${e.stack}`);
          Logger.log(`データ: ${JSON.stringify(data, null, 2)}`);
          throw new Error(`スライド ${i + 1} (タイプ: ${data.type}) の生成に失敗しました: ${e.message}`);
        }
      } else {
        console.warn(`⚠️ 未対応のスライドタイプ: ${data.type}`);
        Logger.log(`警告: 未対応のスライドタイプです - ${data.type}`);
      }
    }
    
    // プレゼンテーションのURLを返す
    const url = presentation.getUrl();
    console.log("🎉 Google スライド生成完了!");
    console.log("🔗 プレゼンテーションURL:", url);
    return url;
    
  } catch (e) {
    console.error("💥 Google スライド生成失敗:", e);
    Logger.log(`スライド生成エラー: ${e.message}\nStack: ${e.stack}`);
    throw e;
  }
}

// --- 5. スライド種別と生成関数のマッピング ---
const slideGenerators = {
  title:    createTitleSlide,
  section:  createSectionSlide,
  content:  createContentSlide,
  compare:  createCompareSlide,
  process:  createProcessSlide,
  timeline: createTimelineSlide,
  diagram:  createDiagramSlide,
  cards:    createCardsSlide,
  table:    createTableSlide,
  progress: createProgressSlide,
  closing:  createClosingSlide
};

// --- 6. 各スライドの生成関数 ---
function createTitleSlide(slide, data, layout) {
  Logger.log('createTitleSlide: 開始');
  try {
    slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
    
    // ロゴの挿入
    try {
      const logoRect = layout.getRect('titleSlide.logo');
      const logo = slide.insertImage(CONFIG.LOGOS.header);
      const aspect = logo.getHeight() / logo.getWidth();
      logo.setLeft(logoRect.left).setTop(logoRect.top).setWidth(logoRect.width).setHeight(logoRect.width * aspect);
      Logger.log('createTitleSlide: ロゴ挿入成功');
    } catch (e) {
      Logger.log(`createTitleSlide: ロゴ挿入エラー - ${e.message}`);
    }
    
    // タイトルの設定
    try {
      const titleRect = layout.getRect('titleSlide.title');
      const titleShape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, titleRect.left, titleRect.top, titleRect.width, titleRect.height);
      setStyledText(titleShape, data.title, { size: CONFIG.FONTS.sizes.title, bold: true });
      Logger.log('createTitleSlide: タイトル設定成功');
    } catch (e) {
      Logger.log(`createTitleSlide: タイトル設定エラー - ${e.message}`);
    }
    
    // 日付の設定
    try {
      const dateRect = layout.getRect('titleSlide.date');
      const dateShape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, dateRect.left, dateRect.top, dateRect.width, dateRect.height);
      if (!safeSetText(dateShape, data.date || '', 'タイトルスライド-日付')) {
        // フォールバック: 直接設定を試す
        const textRange = safeGetText(dateShape, 'タイトルスライド-日付-フォールバック');
        if (textRange) {
          applyTextStyle(textRange, { size: CONFIG.FONTS.sizes.date });
        }
      } else {
        const textRange = safeGetText(dateShape, 'タイトルスライド-日付-スタイル適用');
        if (textRange) {
          applyTextStyle(textRange, { size: CONFIG.FONTS.sizes.date });
        }
      }
      Logger.log('createTitleSlide: 日付設定成功');
    } catch (e) {
      Logger.log(`createTitleSlide: 日付設定エラー - ${e.message}`);
    }
    
    drawBottomBar(slide, layout);
    Logger.log('createTitleSlide: 完了');
  } catch (e) {
    Logger.log(`createTitleSlide: 全体エラー - ${e.message}`);
    Logger.log(`Stack: ${e.stack}`);
    throw e;
  }
}

function createSectionSlide(slide, data, layout, pageNum) {
  Logger.log('createSectionSlide: 開始');
  try {
    slide.getBackground().setSolidFill(CONFIG.COLORS.background_gray);
    
    // セクション番号の決定
    __SECTION_COUNTER++;
    const parsedNum = (() => {
      if (Number.isFinite(data.sectionNo)) return Number(data.sectionNo);
      const m = String(data.title || '').match(/^\s*(\d+)[\.．]/); // Match periods (ASCII and full-width) after digits
      return m ? Number(m[1]) : __SECTION_COUNTER;
    })();
    const num = String(parsedNum).padStart(2, '0');
    Logger.log(`createSectionSlide: セクション番号決定 - ${num}`);
    
    // ゴースト番号の設定
    try {
      const ghostRect = layout.getRect('sectionSlide.ghostNum');
      const ghost = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, ghostRect.left, ghostRect.top, ghostRect.width, ghostRect.height);
      
      if (!safeSetText(ghost, num, 'セクションスライド-ゴースト番号')) {
        Logger.log('createSectionSlide: ゴースト番号の直接設定を試行');
      }
      
      const textRange = safeGetText(ghost, 'セクションスライド-ゴースト番号-スタイル適用');
      if (textRange) {
        applyTextStyle(textRange, { size: CONFIG.FONTS.sizes.ghostNum, color: CONFIG.COLORS.ghost_gray, bold: true });
      }
      
      try { 
        ghost.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE); 
      } catch(e) {
        Logger.log(`createSectionSlide: コンテンツ整列エラー - ${e.message}`);
      }
      Logger.log('createSectionSlide: ゴースト番号設定成功');
    } catch (e) {
      Logger.log(`createSectionSlide: ゴースト番号設定エラー - ${e.message}`);
    }
    
    // タイトルの設定
    try {
      const titleRect = layout.getRect('sectionSlide.title');
      const titleShape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, titleRect.left, titleRect.top, titleRect.width, titleRect.height);
      try {
        titleShape.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
      } catch(e) {
        Logger.log(`createSectionSlide: タイトル整列エラー - ${e.message}`);
      }
      setStyledText(titleShape, data.title, { size: CONFIG.FONTS.sizes.sectionTitle, bold: true, align: SlidesApp.ParagraphAlignment.CENTER });
      Logger.log('createSectionSlide: タイトル設定成功');
    } catch (e) {
      Logger.log(`createSectionSlide: タイトル設定エラー - ${e.message}`);
    }
    
    addGoogleFooter(slide, layout, pageNum);
    Logger.log('createSectionSlide: 完了');
  } catch (e) {
    Logger.log(`createSectionSlide: 全体エラー - ${e.message}`);
    Logger.log(`Stack: ${e.stack}`);
    throw e;
  }
}

// content 1/2 カラム + 箇条書き + 画像
function createContentSlide(slide, data, layout, pageNum) {
  console.log("🎨 contentスライド生成開始:", {
    title: data.title,
    hasPoints: !!data.points,
    pointsCount: Array.isArray(data.points) ? data.points.length : 0,
    hasSubhead: !!data.subhead,
    twoColumn: !!data.twoColumn,
    hasColumns: !!data.columns,
    hasImages: Array.isArray(data.images) && data.images.length > 0
  });

  slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
  drawStandardTitleHeader(slide, layout, 'contentSlide', data.title);
  const dy = drawSubheadIfAny(slide, layout, 'contentSlide', data.subhead);
  
  // アジェンダの処理
  const isAgenda = isAgendaTitle(data.title || '');
  console.log("📋 アジェンダ判定:", {
    title: data.title,
    isAgenda: isAgenda
  });

  let points = Array.isArray(data.points) ? data.points.slice(0) : [];
  
  if (isAgenda && (!points || points.length === 0)) {
    console.log("🔄 アジェンダ自動生成を実行...");
    points = buildAgendaFromSlideData();
    if (points.length === 0) {
      points = ['アジェンダ項目1', '項目2', '項目3'];
      console.log("📝 フォールバックアジェンダを使用:", points);
    }
  }
  
  // contentスライドでpoints配列が空の場合の警告と自動生成
  if (!isAgenda && (!points || points.length === 0)) {
    console.warn("⚠️ contentスライドでpoints配列が空です。デフォルトを生成します。");
    points = [
      `${data.title}について`,
      '重要なポイント',
      '考慮すべき要素'
    ];
    console.log("📝 デフォルトpoints配列を生成:", points);
  }
  
  console.log("✅ 最終的なpoints配列:", points);
  
  const hasImages = Array.isArray(data.images) && data.images.length > 0;
  const isTwo = !!(data.twoColumn || data.columns);
  
  if ((isTwo && (data.columns || points)) || (!isTwo && points && points.length > 0)) {
    if (isTwo) {
      let L = [], R = [];
      if (Array.isArray(data.columns) && data.columns.length === 2) {
        L = data.columns[0] || []; R = data.columns[1] || [];
      } else {
        const mid = Math.ceil(points.length / 2);
        L = points.slice(0, mid); R = points.slice(mid);
      }
      const leftRect = offsetRect(layout.getRect('contentSlide.twoColLeft'), 0, dy);
      const rightRect = offsetRect(layout.getRect('contentSlide.twoColRight'), 0, dy);
      const leftShape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, leftRect.left, leftRect.top, leftRect.width, leftRect.height);
      const rightShape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, rightRect.left, rightRect.top, rightRect.width, rightRect.height);
      setBulletsWithInlineStyles(leftShape, L);
      setBulletsWithInlineStyles(rightShape, R);
    } else {
      const bodyRect = offsetRect(layout.getRect('contentSlide.body'), 0, dy);
      const bodyShape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, bodyRect.left, bodyRect.top, bodyRect.width, bodyRect.height);
      setBulletsWithInlineStyles(bodyShape, points);
    }
  }
  
  // 画像の描画
  if (hasImages) {
    const area = offsetRect(layout.getRect('contentSlide.body'), 0, dy);
    renderImagesInArea(slide, layout, area, normalizeImages(data.images));
  }
  
  drawBottomBarAndFooter(slide, layout, pageNum);
}

// compare 比較表スライド
function createCompareSlide(slide, data, layout, pageNum) {
  slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
  drawStandardTitleHeader(slide, layout, 'compareSlide', data.title);
  const dy = drawSubheadIfAny(slide, layout, 'compareSlide', data.subhead);
  
  const leftBox = offsetRect(layout.getRect('compareSlide.leftBox'), 0, dy);
  const rightBox = offsetRect(layout.getRect('compareSlide.rightBox'), 0, dy);
  drawCompareBox(slide, leftBox, data.leftTitle || '比較 A', data.leftItems || []);
  drawCompareBox(slide, rightBox, data.rightTitle || '比較 B', data.rightItems || []);
  
  drawBottomBarAndFooter(slide, layout, pageNum);
}

function drawCompareBox(slide, rect, title, items) {
  const box = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, rect.left, rect.top, rect.width, rect.height);
  box.getFill().setSolidFill(CONFIG.COLORS.lane_title_bg);
  box.getBorder().getLineFill().setSolidFill(CONFIG.COLORS.lane_border);
  box.getBorder().setWeight(1);
  
  const th = 0.75 * 40; // 約 30px 相当
  const titleBar = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, rect.left, rect.top, rect.width, th);
  titleBar.getFill().setSolidFill(CONFIG.COLORS.primary_blue);
  titleBar.getBorder().setTransparent();
  setStyledText(titleBar, title, { size: CONFIG.FONTS.sizes.laneTitle, bold: true, color: CONFIG.COLORS.background_white, align: SlidesApp.ParagraphAlignment.CENTER });
  
  const pad = 0.75 * 12;
  const textRect = { left: rect.left + pad, top: rect.top + th + pad, width: rect.width - pad * 2, height: rect.height - th - pad * 2 };
  const body = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, textRect.left, textRect.top, textRect.width, textRect.height);
  setBulletsWithInlineStyles(body, items);
}

// process 縦型プロセス
function createProcessSlide(slide, data, layout, pageNum) {
  Logger.log('createProcessSlide: 開始');
  try {
    slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
    drawStandardTitleHeader(slide, layout, 'processSlide', data.title);
    const dy = drawSubheadIfAny(slide, layout, 'processSlide', data.subhead);
    
    const area = offsetRect(layout.getRect('processSlide.area'), 0, dy);
    const steps = Array.isArray(data.steps) ? data.steps : [];
    const n = Math.max(1, steps.length);
    Logger.log(`createProcessSlide: ステップ数 - ${n}`);
    
    const gapY = (area.height - layout.pxToPt(40)) / Math.max(1, n - 1);
    const cx = area.left + layout.pxToPt(44);
    const top0 = area.top + layout.pxToPt(10);
    
    const line = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, cx - layout.pxToPt(1), top0 + layout.pxToPt(6), layout.pxToPt(2), gapY * (n - 1));
    line.getFill().setSolidFill(CONFIG.COLORS.faint_gray); line.getBorder().setTransparent();
    
    for (let i = 0; i < n; i++) {
      Logger.log(`createProcessSlide: ステップ ${i + 1} 作成中`);
      try {
        const cy = top0 + gapY * i;
        const sz = layout.pxToPt(28);
        const numBox = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, cx - sz/2, cy - sz/2, sz, sz);
        numBox.getFill().setSolidFill(CONFIG.COLORS.background_white);
        numBox.getBorder().getLineFill().setSolidFill(CONFIG.COLORS.primary_blue);
        numBox.getBorder().setWeight(1);
        
        // 番号ボックスのテキスト設定（エラーが起きやすい箇所）
        if (!safeSetText(numBox, String(i + 1), `プロセススライド-番号ボックス-${i + 1}`)) {
          Logger.log(`createProcessSlide: 番号ボックス ${i + 1} のテキスト設定に失敗、直接設定を試行`);
          try {
            const num = numBox.getText(); 
            num.setText(String(i + 1));
          } catch (e) {
            Logger.log(`createProcessSlide: 番号ボックス ${i + 1} の直接設定も失敗 - ${e.message}`);
          }
        }
        
        const textRange = safeGetText(numBox, `プロセススライド-番号ボックススタイル-${i + 1}`);
        if (textRange) {
          applyTextStyle(textRange, { size: 12, bold: true, color: CONFIG.COLORS.primary_blue, align: SlidesApp.ParagraphAlignment.CENTER });
        }
        
        // テキストボックスの作成
        const txt = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, cx + layout.pxToPt(28), cy - layout.pxToPt(16), area.width - layout.pxToPt(70), layout.pxToPt(32));
        setStyledText(txt, steps[i] || '', { size: CONFIG.FONTS.sizes.processStep });
        try { txt.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE); } catch(e){
          Logger.log(`createProcessSlide: テキスト整列エラー ${i + 1} - ${e.message}`);
        }
        
        Logger.log(`createProcessSlide: ステップ ${i + 1} 完了`);
      } catch (e) {
        Logger.log(`createProcessSlide: ステップ ${i + 1} でエラー - ${e.message}`);
        Logger.log(`Stack: ${e.stack}`);
        throw e;
      }
    }
    
    drawBottomBarAndFooter(slide, layout, pageNum);
    Logger.log('createProcessSlide: 完了');
  } catch (e) {
    Logger.log(`createProcessSlide: 全体エラー - ${e.message}`);
    Logger.log(`Stack: ${e.stack}`);
    throw e;
  }
}

// timeline 横型タイムライン
function createTimelineSlide(slide, data, layout, pageNum) {
  slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
  drawStandardTitleHeader(slide, layout, 'timelineSlide', data.title);
  const dy = drawSubheadIfAny(slide, layout, 'timelineSlide', data.subhead);
  
  const area = offsetRect(layout.getRect('timelineSlide.area'), 0, dy);
  const milestones = Array.isArray(data.milestones) ? data.milestones : [];
  if (milestones.length === 0) { drawBottomBarAndFooter(slide, layout, pageNum); return; }
  
  const inner = layout.pxToPt(60);
  const baseY = area.top + area.height * 0.55;
  const leftX = area.left + inner;
  const rightX = area.left + area.width - inner;
  
  const line = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, leftX, baseY - layout.pxToPt(1), rightX - leftX, layout.pxToPt(2));
  line.getFill().setSolidFill(CONFIG.COLORS.faint_gray);
  line.getBorder().setTransparent();
  
  const dotR = layout.pxToPt(8);
  const gap = (rightX - leftX) / Math.max(1, (milestones.length - 1));
  
  milestones.forEach((m, i) => {
    Logger.log(`createTimelineSlide: マイルストーン ${i + 1} 作成中`);
    try {
      const x = leftX + gap * i - dotR / 2;
      const dot = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, x, baseY - dotR / 2, dotR, dotR);
      const state = (m.state || 'todo').toLowerCase();
      if (state === 'done') { dot.getFill().setSolidFill(CONFIG.COLORS.google_green); dot.getBorder().setTransparent(); }
      else if (state === 'next') { dot.getFill().setSolidFill(CONFIG.COLORS.background_white); dot.getBorder().getLineFill().setSolidFill(CONFIG.COLORS.google_yellow); dot.getBorder().setWeight(2); }
      else { dot.getFill().setSolidFill(CONFIG.COLORS.background_white); dot.getBorder().getLineFill().setSolidFill(CONFIG.COLORS.neutral_gray); dot.getBorder().setWeight(1); }
      
      // ラベルテキストの設定（エラーが起きやすい箇所）
      const t = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, x - layout.pxToPt(40), baseY - layout.pxToPt(40), layout.pxToPt(90), layout.pxToPt(20));
      if (!safeSetText(t, String(m.label || ''), `タイムライン-ラベル-${i + 1}`)) {
        Logger.log(`createTimelineSlide: ラベル ${i + 1} のテキスト設定に失敗、直接設定を試行`);
        try {
          t.getText().setText(String(m.label || ''));
        } catch (e) {
          Logger.log(`createTimelineSlide: ラベル ${i + 1} の直接設定も失敗 - ${e.message}`);
        }
      }
      
      const labelRange = safeGetText(t, `タイムライン-ラベルスタイル-${i + 1}`);
      if (labelRange) {
        applyTextStyle(labelRange, { size: CONFIG.FONTS.sizes.small, bold: true, align: SlidesApp.ParagraphAlignment.CENTER });
      }
      
      // 日付テキストの設定（エラーが起きやすい箇所）
      const d = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, x - layout.pxToPt(40), baseY + layout.pxToPt(8), layout.pxToPt(90), layout.pxToPt(18));
      if (!safeSetText(d, String(m.date || ''), `タイムライン-日付-${i + 1}`)) {
        Logger.log(`createTimelineSlide: 日付 ${i + 1} のテキスト設定に失敗、直接設定を試行`);
        try {
          d.getText().setText(String(m.date || ''));
        } catch (e) {
          Logger.log(`createTimelineSlide: 日付 ${i + 1} の直接設定も失敗 - ${e.message}`);
        }
      }
      
      const dateRange = safeGetText(d, `タイムライン-日付スタイル-${i + 1}`);
      if (dateRange) {
        applyTextStyle(dateRange, { size: CONFIG.FONTS.sizes.small, color: CONFIG.COLORS.neutral_gray, align: SlidesApp.ParagraphAlignment.CENTER });
      }
      
      Logger.log(`createTimelineSlide: マイルストーン ${i + 1} 完了`);
    } catch (e) {
      Logger.log(`createTimelineSlide: マイルストーン ${i + 1} でエラー - ${e.message}`);
      Logger.log(`Stack: ${e.stack}`);
      throw e;
    }
  });
  
  drawBottomBarAndFooter(slide, layout, pageNum);
}

// diagram Mermaid風のレーン図
function createDiagramSlide(slide, data, layout, pageNum) {
  slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
  drawStandardTitleHeader(slide, layout, 'diagramSlide', data.title);
  const dy = drawSubheadIfAny(slide, layout, 'diagramSlide', data.subhead);
  
  const lanes = Array.isArray(data.lanes) ? data.lanes : [];
  const area0 = layout.getRect('diagramSlide.lanesArea');
  const area = offsetRect(area0, 0, dy);
  
  const px = (p)=> layout.pxToPt(p);
  const laneGap = px(CONFIG.DIAGRAM.laneGap_px);
  const lanePad = px(CONFIG.DIAGRAM.lanePad_px);
  const laneTitleH = px(CONFIG.DIAGRAM.laneTitle_h_px);
  const cardGap = px(CONFIG.DIAGRAM.cardGap_px);
  const cardMinH = px(CONFIG.DIAGRAM.cardMin_h_px);
  const cardMaxH = px(CONFIG.DIAGRAM.cardMax_h_px);
  const arrowH = px(CONFIG.DIAGRAM.arrow_h_px);
  const arrowGap = px(CONFIG.DIAGRAM.arrowGap_px);
  
  const n = Math.max(1, lanes.length);
  const laneW = (area.width - laneGap * (n - 1)) / n;
  
  const cardBoxes = [];
  
  for (let j = 0; j < n; j++) {
    const lane = lanes[j] || { title: '', items: [] };
    const left = area.left + j * (laneW + laneGap);
    const top = area.top;
    
    const lt = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, left, top, laneW, laneTitleH);
    lt.getFill().setSolidFill(CONFIG.COLORS.lane_title_bg);
    lt.getBorder().getLineFill().setSolidFill(CONFIG.COLORS.lane_border);
    lt.getBorder().setWeight(1);
    // レーンタイトルの設定（エラーが起きやすい箇所）
    if (!safeSetText(lt, lane.title || '', `ダイアグラム-レーンタイトル-${j + 1}`)) {
      Logger.log(`createDiagramSlide: レーンタイトル ${j + 1} のテキスト設定に失敗、直接設定を試行`);
      try {
        lt.getText().setText(lane.title || '');
      } catch (e) {
        Logger.log(`createDiagramSlide: レーンタイトル ${j + 1} の直接設定も失敗 - ${e.message}`);
      }
    }
    
    const ltRange = safeGetText(lt, `ダイアグラム-レーンタイトルスタイル-${j + 1}`);
    if (ltRange) {
      applyTextStyle(ltRange, { size: CONFIG.FONTS.sizes.laneTitle, bold: true, align: SlidesApp.ParagraphAlignment.CENTER });
    }
    
    const items = Array.isArray(lane.items) ? lane.items : [];
    const availH = area.height - laneTitleH - lanePad * 2;
    const rows = Math.max(1, items.length);
    const idealH = (availH - cardGap * (rows - 1)) / rows;
    const cardH = Math.max(cardMinH, Math.min(cardMaxH, idealH));
    const totalH = cardH * rows + cardGap * (rows - 1);
    const firstTop = top + laneTitleH + lanePad + Math.max(0, (availH - totalH) / 2);
    
    cardBoxes[j] = [];
    for (let i = 0; i < rows; i++) {
      const cardTop = firstTop + i * (cardH + cardGap);
      const cardLeft = left + lanePad;
      const cardWidth = laneW - lanePad * 2;
      
      const card = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, cardLeft, cardTop, cardWidth, cardH);
      card.getFill().setSolidFill(CONFIG.COLORS.card_bg);
      card.getBorder().getLineFill().setSolidFill(CONFIG.COLORS.card_border);
      card.getBorder().setWeight(1);
      setStyledText(card, items[i] || '', { size: CONFIG.FONTS.sizes.body });
      
      try { card.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE); } catch(e){}
      cardBoxes[j][i] = { left: cardLeft, top: cardTop, width: cardWidth, height: cardH };
    }
  }
  
  // カード間の矢印を描画
  const maxRows = Math.max(...cardBoxes.map(a => a.length));
  for (let j = 0; j < n - 1; j++) {
    const L = cardBoxes[j], R = cardBoxes[j + 1];
    for (let i = 0; i < maxRows; i++) {
      const a = L[i], b = R[i];
      if (a && b) drawArrowBetweenRects(slide, a, b, arrowH, arrowGap);
    }
  }
  
  drawBottomBarAndFooter(slide, layout, pageNum);
}

// cards カード型レイアウト title/desc も使える
function createCardsSlide(slide, data, layout, pageNum) {
  slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
  drawStandardTitleHeader(slide, layout, 'cardsSlide', data.title);
  const dy = drawSubheadIfAny(slide, layout, 'cardsSlide', data.subhead);
  
  const area = offsetRect(layout.getRect('cardsSlide.gridArea'), 0, dy);
  const items = Array.isArray(data.items) ? data.items : [];
  const cols = Math.min(3, Math.max(2, Number(data.columns) || (items.length <= 4 ? 2 : 3)));
  const gap = layout.pxToPt(16);
  const rows = Math.ceil(items.length / cols);
  const cardW = (area.width - gap * (cols - 1)) / cols;
  const cardH = Math.max(layout.pxToPt(92), (area.height - gap * (rows - 1)) / rows);
  
  for (let idx = 0; idx < items.length; idx++) {
    const r = Math.floor(idx / cols), c = idx % cols;
    const left = area.left + c * (cardW + gap);
    const top  = area.top  + r * (cardH + gap);
    
    const card = slide.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, left, top, cardW, cardH);
    card.getFill().setSolidFill(CONFIG.COLORS.card_bg);
    card.getBorder().getLineFill().setSolidFill(CONFIG.COLORS.card_border);
    card.getBorder().setWeight(1);
    
    const obj = items[idx];
    if (typeof obj === 'string') {
      setStyledText(card, obj, { size: CONFIG.FONTS.sizes.body });
    } else {
      const title = String(obj.title || '');
      const desc  = String(obj.desc || '');
      const combined = `${title}${desc ? '\n' + desc : ''}`;
      setStyledText(card, combined, { size: CONFIG.FONTS.sizes.body });
      if (title.length > 0) {
        try { 
          const cardRange = safeGetText(card, `カード-タイトル範囲-${idx + 1}`);
          if (cardRange) {
            cardRange.getRange(0, title.length).getTextStyle().setBold(true);
          }
        } catch(e){
          Logger.log(`createCardsSlide: カード ${idx + 1} のタイトルスタイル適用失敗 - ${e.message}`);
        }
      }
    }
    try { card.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE); } catch(e) {}
  }
  
  drawBottomBarAndFooter(slide, layout, pageNum);
}

// table Slides APIのテーブルは不安定なため自前で描画
function createTableSlide(slide, data, layout, pageNum) {
  slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
  drawStandardTitleHeader(slide, layout, 'tableSlide', data.title);
  const dy = drawSubheadIfAny(slide, layout, 'tableSlide', data.subhead);
  
  const area = offsetRect(layout.getRect('tableSlide.area'), 0, dy);
  const headers = Array.isArray(data.headers) ? data.headers : [];
  const rows = Array.isArray(data.rows) ? data.rows : [];
  
  try {
    if (headers.length > 0) {
      const table = slide.insertTable(rows.length + 1, headers.length);
      table.setLeft(area.left).setTop(area.top).setWidth(area.width);
      for (let c = 0; c < headers.length; c++) {
        const cell = table.getCell(0, c);
        setStyledText(cell, String(headers[c] || ''), { bold: true, align: SlidesApp.ParagraphAlignment.CENTER });
      }
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r] || [];
        for (let c = 0; c < headers.length; c++) {
          const cell = table.getCell(r + 1, c);
          setStyledText(cell, String(row[c] || ''), { align: SlidesApp.ParagraphAlignment.CENTER });
        }
      }
    } else {
      throw new Error('headers is empty');
    }
  } catch (e) {
    const cols = Math.max(1, headers.length || 3);
    const rcount = rows.length + 1;
    const gap = layout.pxToPt(1);
    const cellW = (area.width - gap * (cols - 1)) / cols;
    const cellH = (area.height - gap * (rcount - 1)) / rcount;
    const drawCell = (r, c, text, bold) => {
      const left = area.left + c * (cellW + gap);
      const top  = area.top  + r * (cellH + gap);
      const cell = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, left, top, cellW, cellH);
      cell.getFill().setSolidFill(CONFIG.COLORS.background_white);
      cell.getBorder().getLineFill().setSolidFill(CONFIG.COLORS.card_border);
      cell.getBorder().setWeight(1);
      setStyledText(cell, String(text || ''), { bold: !!bold, align: SlidesApp.ParagraphAlignment.CENTER });
      try { cell.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE); } catch(e){}
    };
    (headers.length ? headers : ['項目','値 1','値 2']).forEach((h, c) => drawCell(0, c, h, true));
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r] || [];
      for (let c = 0; c < (headers.length || 3); c++) drawCell(r + 1, c, row[c], false);
    }
  }
  
  drawBottomBarAndFooter(slide, layout, pageNum);
}

// progress 進捗バー
function createProgressSlide(slide, data, layout, pageNum) {
  slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
  drawStandardTitleHeader(slide, layout, 'progressSlide', data.title);
  const dy = drawSubheadIfAny(slide, layout, 'progressSlide', data.subhead);
  
  const area = offsetRect(layout.getRect('progressSlide.area'), 0, dy);
  const items = Array.isArray(data.items) ? data.items : [];
  const n = Math.max(1, items.length);
  const rowH = area.height / n;
  
  for (let i = 0; i < n; i++) {
    const y = area.top + i * rowH + layout.pxToPt(6);
    const label = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, area.left, y, layout.pxToPt(150), layout.pxToPt(18));
    setStyledText(label, String(items[i].label || ''), { size: CONFIG.FONTS.sizes.body });
    
    const barLeft = area.left + layout.pxToPt(160);
    const barW    = area.width - layout.pxToPt(210);
    const barBG = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, barLeft, y, barW, layout.pxToPt(14));
    barBG.getFill().setSolidFill(CONFIG.COLORS.faint_gray); barBG.getBorder().setTransparent();
    
    const p = Math.max(0, Math.min(100, Number(items[i].percent || 0)));
    const barFG = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, barLeft, y, barW * (p/100), layout.pxToPt(14));
    barFG.getFill().setSolidFill(CONFIG.COLORS.google_green); barFG.getBorder().setTransparent();
    
    const pct = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, barLeft + barW + layout.pxToPt(6), y - layout.pxToPt(1), layout.pxToPt(40), layout.pxToPt(16));
    
    // パーセンテージテキストの設定（エラーが起きやすい箇所）
    if (!safeSetText(pct, String(p) + '%', `プログレス-パーセント-${i + 1}`)) {
      Logger.log(`createProgressSlide: パーセント ${i + 1} のテキスト設定に失敗、直接設定を試行`);
      try {
        pct.getText().setText(String(p) + '%');
      } catch (e) {
        Logger.log(`createProgressSlide: パーセント ${i + 1} の直接設定も失敗 - ${e.message}`);
      }
    }
    
    const pctRange = safeGetText(pct, `プログレス-パーセントスタイル-${i + 1}`);
    if (pctRange) {
      applyTextStyle(pctRange, { size: CONFIG.FONTS.sizes.small, color: CONFIG.COLORS.neutral_gray });
    }
  }
  
  drawBottomBarAndFooter(slide, layout, pageNum);
}

function createClosingSlide(slide, data, layout) {
  slide.getBackground().setSolidFill(CONFIG.COLORS.background_white);
  const image = slide.insertImage(CONFIG.LOGOS.closing);
  const imgW_pt = layout.pxToPt(450) * layout.scaleX;
  const aspect = image.getHeight() / image.getWidth();
  image.setWidth(imgW_pt).setHeight(imgW_pt * aspect);
  image.setLeft((layout.pageW_pt - imgW_pt) / 2).setTop((layout.pageH_pt - (imgW_pt * aspect)) / 2);
}

// --- 7. ヘルパー関数 ---

// 安全にテキストを設定するためのヘルパー関数
function safeSetText(shape, text, context = 'unknown') {
  try {
    if (!shape) {
      Logger.log(`エラー: ${context} - シェイプがnullまたはundefinedです`);
      return false;
    }
    const textRange = shape.getText();
    if (!textRange) {
      Logger.log(`エラー: ${context} - テキスト範囲を取得できませんでした`);
      return false;
    }
    textRange.setText(String(text || ''));
    Logger.log(`成功: ${context} - テキストを設定しました: "${String(text || '').substring(0, 20)}..."`);
    return true;
  } catch (e) {
    Logger.log(`エラー: ${context} - テキスト設定に失敗しました: ${e.message}`);
    Logger.log(`Stack: ${e.stack}`);
    return false;
  }
}

// 安全にテキスト範囲を取得するためのヘルパー関数  
function safeGetText(shape, context = 'unknown') {
  try {
    if (!shape) {
      Logger.log(`エラー: ${context} - シェイプがnullまたはundefinedです`);
      return null;
    }
    const textRange = shape.getText();
    if (!textRange) {
      Logger.log(`エラー: ${context} - テキスト範囲を取得できませんでした`);
      return null;
    }
    Logger.log(`成功: ${context} - テキスト範囲を取得しました`);
    return textRange;
  } catch (e) {
    Logger.log(`エラー: ${context} - テキスト範囲取得に失敗しました: ${e.message}`);
    Logger.log(`Stack: ${e.stack}`);
    return null;
  }
}

function createLayoutManager(pageW_pt, pageH_pt) {
  const pxToPt = (px) => px * 0.75;
  const baseW_pt = pxToPt(CONFIG.BASE_PX.W);
  const baseH_pt = pxToPt(CONFIG.BASE_PX.H);
  const scaleX = pageW_pt / baseW_pt;
  const scaleY = pageH_pt / baseH_pt;
  
  const getPositionFromPath = (path) => path.split('.').reduce((obj, key) => obj[key], CONFIG.POS_PX);
  return {
    scaleX, scaleY, pageW_pt, pageH_pt, pxToPt,
    getRect: (spec) => {
      const pos = typeof spec === 'string' ? getPositionFromPath(spec) : spec;
      let left_px = pos.left;
      if (pos.right !== undefined && pos.left === undefined) {
        left_px = CONFIG.BASE_PX.W - pos.right - pos.width;
      }
      return {
        left:   left_px !== undefined ? pxToPt(left_px) * scaleX : undefined,
        top:    pos.top !== undefined ? pxToPt(pos.top) * scaleY : undefined,
        width:  pos.width !== undefined ? pxToPt(pos.width) * scaleX : undefined,
        height: pos.height !== undefined ? pxToPt(pos.height) * scaleY : undefined,
      };
    }
  };
}

function offsetRect(rect, dx, dy) {
  return { left: rect.left + (dx || 0), top: rect.top + (dy || 0), width: rect.width, height: rect.height };
}

function drawStandardTitleHeader(slide, layout, key, title) {
  const logoRect = layout.getRect(`${key}.headerLogo`);
  const logo = slide.insertImage(CONFIG.LOGOS.header);
  const asp = logo.getHeight() / logo.getWidth();
  logo.setLeft(logoRect.left).setTop(logoRect.top).setWidth(logoRect.width).setHeight(logoRect.width * asp);
  
  const titleRect = layout.getRect(`${key}.title`);
  const titleShape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, titleRect.left, titleRect.top, titleRect.width, titleRect.height);
  setStyledText(titleShape, title || '', { size: CONFIG.FONTS.sizes.contentTitle, bold: true });
  
  const uRect = layout.getRect(`${key}.titleUnderline`);
  const u = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, uRect.left, uRect.top, uRect.width, uRect.height);
  u.getFill().setSolidFill(CONFIG.COLORS.primary_blue);
  u.getBorder().setTransparent();
}

function drawSubheadIfAny(slide, layout, key, subhead) {
  if (!subhead) return 0;
  const rect = layout.getRect(`${key}.subhead`);
  const box = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, rect.left, rect.top, rect.width, rect.height);
  setStyledText(box, subhead, { size: CONFIG.FONTS.sizes.subhead, color: CONFIG.COLORS.text_primary });
  return layout.pxToPt(36);
}

function drawBottomBar(slide, layout) {
  const barRect = layout.getRect('bottomBar');
  const bar = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, barRect.left, barRect.top, barRect.width, barRect.height);
  bar.getFill().setSolidFill(CONFIG.COLORS.primary_blue);
  bar.getBorder().setTransparent();
}

function drawBottomBarAndFooter(slide, layout, pageNum) {
  drawBottomBar(slide, layout);
  addGoogleFooter(slide, layout, pageNum);
}

function addGoogleFooter(slide, layout, pageNum) {
  try {
    const leftRect = layout.getRect('footer.leftText');
    const leftShape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, leftRect.left, leftRect.top, leftRect.width, leftRect.height);
    
    // フッターテキストの設定（エラーが起きやすい箇所）
    if (!safeSetText(leftShape, CONFIG.FOOTER_TEXT, 'フッター-左テキスト')) {
      Logger.log('addGoogleFooter: 左フッターテキスト設定に失敗、直接設定を試行');
      try {
        leftShape.getText().setText(CONFIG.FOOTER_TEXT);
      } catch (e) {
        Logger.log(`addGoogleFooter: 左フッターテキスト直接設定も失敗 - ${e.message}`);
      }
    }
    
    const leftRange = safeGetText(leftShape, 'フッター-左テキストスタイル');
    if (leftRange) {
      applyTextStyle(leftRange, { size: CONFIG.FONTS.sizes.footer, color: CONFIG.COLORS.text_primary });
    }
    
    if (pageNum > 0) {
      const rightRect = layout.getRect('footer.rightPage');
      const rightShape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, rightRect.left, rightRect.top, rightRect.width, rightRect.height);
      
      // ページ番号の設定（エラーが起きやすい箇所）
      if (!safeSetText(rightShape, String(pageNum), 'フッター-ページ番号')) {
        Logger.log('addGoogleFooter: ページ番号設定に失敗、直接設定を試行');
        try {
          rightShape.getText().setText(String(pageNum));
        } catch (e) {
          Logger.log(`addGoogleFooter: ページ番号直接設定も失敗 - ${e.message}`);
        }
      }
      
      const rightRange = safeGetText(rightShape, 'フッター-ページ番号スタイル');
      if (rightRange) {
        applyTextStyle(rightRange, { size: CONFIG.FONTS.sizes.footer, color: CONFIG.COLORS.primary_blue, align: SlidesApp.ParagraphAlignment.END });
      }
    }
  } catch (e) {
    Logger.log(`addGoogleFooter: フッター追加エラー - ${e.message}`);
    Logger.log(`Stack: ${e.stack}`);
    // フッターエラーはスライド生成を停止させないため、例外を再スローしない
  }
}

function applyTextStyle(textRange, opt) {
  const style = textRange.getTextStyle();
  style.setFontFamily(CONFIG.FONTS.family);
  style.setForegroundColor(opt.color || CONFIG.COLORS.text_primary);
  style.setFontSize(opt.size || CONFIG.FONTS.sizes.body);
  style.setBold(opt.bold || false);
  if (opt.align) {
    try { textRange.getParagraphs().forEach(p => p.getRange().getParagraphStyle().setParagraphAlignment(opt.align)); } catch (e) {}
  }
}

function setStyledText(shapeOrCell, rawText, baseOpt) {
  const parsed = parseInlineStyles(rawText || '');
  const tr = shapeOrCell.getText();
  tr.setText(parsed.output);
  applyTextStyle(tr, baseOpt || {});
  applyStyleRanges(tr, parsed.ranges);
}

function setBulletsWithInlineStyles(shape, points) {
  const joiner = '\n\n';
  let combined = '';
  const ranges = [];
  
  (points || []).forEach((pt, idx) => {
    const parsed = parseInlineStyles(String(pt || ''));
    const bullet = '・ ' + parsed.output;
    if (idx > 0) combined += joiner;
    const start = combined.length;
    combined += bullet;
    
    parsed.ranges.forEach(r => {
      ranges.push({ start: start + 2 + r.start, end: start + 2 + r.end, bold: r.bold, color: r.color });
    });
  });
  
  const tr = shape.getText();
  tr.setText(combined || '・ ');
  applyTextStyle(tr, { size: CONFIG.FONTS.sizes.body });
  
  try {
    tr.getParagraphs().forEach(p => {
      const ps = p.getRange().getParagraphStyle();
      ps.setLineSpacing(100);
      ps.setSpaceBelow(6);
    });
  } catch (e) {}
  
  applyStyleRanges(tr, ranges);
}

function parseInlineStyles(s) {
  const ranges = [];
  let out = '';
  for (let i = 0; i < s.length; ) {
    // [[R*W]]
    if (s[i] === '[' && s[i+1] === '[') {
      const close = s.indexOf(']]', i + 2);
      if (close !== -1) {
        const content = s.substring(i + 2, close);
        const start = out.length;
        out += content;
        const end = out.length;
        ranges.push({ start, end, bold: true, color: CONFIG.COLORS.primary_blue });
        i = close + 2; continue;
      }
    }
    // ***W**
    if (s[i] === '*' && s[i+1] === '*') {
      const close = s.indexOf('**', i + 2);
      if (close !== -1) {
        const content = s.substring(i + 2, close);
        const start = out.length;
        out += content;
        const end = out.length;
        ranges.push({ start, end, bold: true });
        i = close + 2; continue;
      }
    }
    out += s[i]; i++;
  }
  return { output: out, ranges };
}

function applyStyleRanges(textRange, ranges) {
  ranges.forEach(r => {
    try {
      const sub = textRange.getRange(r.start, r.end);
      if (!sub) return;
      const st = sub.getTextStyle();
      if (r.bold)  st.setBold(true);
      if (r.color) st.setForegroundColor(r.color);
    } catch (e) {}
  });
}

function normalizeImages(arr) {
  return (arr || []).map(v => {
    if (typeof v === 'string') return { url: v };
    if (v && typeof v.url === 'string') return { url: v.url, caption: v.caption || '' };
    return null;
  }).filter(Boolean).slice(0, 6);
}

function renderImagesInArea(slide, layout, area, images) {
  if (!images || images.length === 0) return;
  const n = Math.min(6, images.length);
  let cols = 1, rows = 1;
  if (n === 1) { cols = 1; rows = 1; }
  else if (n === 2) { cols = 2; rows = 1; }
  else if (n <= 4) { cols = 2; rows = 2; }
  else { cols = 3; rows = 2; }
  
  const gap = layout.pxToPt(10);
  const cellW = (area.width - gap * (cols - 1)) / cols;
  const cellH = (area.height - gap * (rows - 1)) / rows;
  
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const left = area.left + c * (cellW + gap);
    const top  = area.top  + r * (cellH + gap);
    try {
      const img = slide.insertImage(images[i].url);
      const scale = Math.min(cellW / img.getWidth(), cellH / img.getHeight());
      const w = img.getWidth() * scale;
      const h = img.getHeight() * scale;
      img.setWidth(w).setHeight(h);
      img.setLeft(left + (cellW - w) / 2).setTop(top + (cellH - h) / 2);
    } catch(e) {}
  }
}

function isAgendaTitle(title) {
  const t = String(title || '').toLowerCase();
  return /(agenda|アジェンダ|あじぇんだ|本日の流れ)/.test(t);
}

// グローバル変数：現在処理中のslideData
let _globalSlideData = [];

function buildAgendaFromSlideData() {
  console.log("📋 アジェンダ自動生成開始...");
  
  // グローバル変数からslideDataを取得
  const slideData = _globalSlideData;
  console.log("🔍 アジェンダ用slideData取得:", {
    total: slideData.length,
    types: slideData.map(s => s.type)
  });
  
  let agendaItems = [];
  
  if (slideData.length > 0) {
    // 1. まずsection.titleを収集
    agendaItems = slideData
      .filter(s => s.type === 'section')
      .map(s => s.title)
      .filter(title => title && title.trim())
      .slice(0, 5); // 最大5項目
      
    console.log("📝 sectionタイトルから生成:", agendaItems);
    
    // 2. sectionが見つからない場合は、contentスライドのタイトルを使用
    if (agendaItems.length === 0) {
      agendaItems = slideData
        .filter(s => s.type === 'content' && !isAgendaTitle(s.title || ''))
        .map(s => s.title)
        .filter(title => title && title.trim())
        .slice(0, 5); // 最大5項目
        
      console.log("📝 contentタイトルから生成:", agendaItems);
    }
    
    // 3. その他のスライドタイプからも収集
    if (agendaItems.length === 0) {
      agendaItems = slideData
        .filter(s => ['compare', 'process', 'timeline', 'diagram', 'cards', 'table', 'progress'].includes(s.type))
        .map(s => s.title)
        .filter(title => title && title.trim())
        .slice(0, 5); // 最大5項目
        
      console.log("📝 その他スライドタイトルから生成:", agendaItems);
    }
  }
  
  // それでも空の場合はデフォルトのアジェンダを生成
  if (agendaItems.length === 0) {
    agendaItems = ['本日の目的', '重要なポイント', '次のステップ'];
    console.log("📝 デフォルトアジェンダを生成:", agendaItems);
  }
  
  console.log("✅ アジェンダ自動生成完了:", agendaItems);
  return agendaItems;
}

function drawArrowBetweenRects(slide, a, b, arrowH, arrowGap) {
  const fromX = a.left + a.width;
  const toX   = b.left;
  const width = Math.max(0, toX - fromX - arrowGap * 2);
  if (width < 8) return;
  const yMid = ((a.top + a.height/2) + (b.top + b.height/2)) / 2;
  const top = yMid - arrowH / 2;
  const left = fromX + arrowGap;
  const arr = slide.insertShape(SlidesApp.ShapeType.RIGHT_ARROW, left, top, width, arrowH);
  arr.getFill().setSolidFill(CONFIG.COLORS.primary_blue);
  arr.getBorder().setTransparent();
}
