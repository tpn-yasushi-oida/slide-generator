/**
 * Gemini APIを呼び出すためのコアスクリプト
 * 構造化出力を使用してslideDataを生成します。
 */

// --- 1. スクリプトプロパティ ---
const PROJECT_ID =
  PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
const REGION =
  PropertiesService.getScriptProperties().getProperty("REGION") ||
  "us-central1";
const CLIENT_EMAIL =
  PropertiesService.getScriptProperties().getProperty("CLIENT_EMAIL");
const PRIVATE_KEY =
  PropertiesService.getScriptProperties().getProperty("PRIVATE_KEY");
const PARSED_PRIVATE_KEY = PRIVATE_KEY
  ? PRIVATE_KEY.replace(/\\n/g, "\n")
  : null;
const GEMINI_MODEL =
  PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL") ||
  "gemini-1.5-flash-latest";

// 代替手段(API KEYで generativelanguage.googleapis.com を利用)
const GEMINI_API_KEY =
  PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");

/**
 * OAuth 2.0 アクセストークンを取得 (Vertex AI用)
 * @returns {string} アクセストークン
 */
function getAccessToken() {
  try {
    if (!CLIENT_EMAIL || !PRIVATE_KEY) {
      throw new Error("サービスアカウントの認証情報が設定されていません。");
    }

    // JWTの作成
    const header = {
      alg: "RS256",
      typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    const signatureInput =
      Utilities.base64EncodeWebSafe(JSON.stringify(header)) +
      "." +
      Utilities.base64EncodeWebSafe(JSON.stringify(payload));

    const signature = Utilities.computeRsaSha256Signature(
      signatureInput,
      PARSED_PRIVATE_KEY
    );

    const jwt = signatureInput + "." + Utilities.base64EncodeWebSafe(signature);

    // OAuth 2.0トークンの取得
    const tokenResponse = UrlFetchApp.fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "post",
        payload: {
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: jwt,
        },
      }
    );

    const tokenData = JSON.parse(tokenResponse.getContentText());
    if (!tokenData.access_token) {
      throw new Error("アクセストークンの取得に失敗しました。");
    }

    return tokenData.access_token;
  } catch (error) {
    Logger.log(`アクセストークン取得エラー: ${error.message}`);
    throw error;
  }
}

/**
 * Gemini APIを呼び出し、構造化されたslideDataを生成
 * @param {string} userPrompt - ユーザーが入力したプロンプト
 * @returns {Object} 生成されたslideDataのJSON
 */
function generateSlideDataWithGemini(userPrompt) {
  try {
    Logger.log("Gemini APIでslideData生成開始");

    // プロンプト作成
    const fullPrompt = getGeminiPrompt() + "\n\n" + userPrompt;
    const responseSchema = getSlideDataSchema();

    // 優先: Vertex AI を利用
    if (PROJECT_ID && CLIENT_EMAIL && PRIVATE_KEY) {
      try {
        const data = callGeminiVertexAI(fullPrompt, responseSchema);
        const slideCount = Array.isArray(data)
          ? data.length
          : (data && Array.isArray(data.slideData) ? data.slideData.length : 0);
        Logger.log(`slideData生成完了: ${slideCount}枚のスライド`);
        return data;
      } catch (vertexError) {
        Logger.log(`Vertex AI呼び出しに失敗: ${vertexError.message}`);
        Logger.log("代替手段: generativelanguage.googleapis.com を試します。");
      }
    }

    // 代替手段: generativelanguage.googleapis.com
    if (GEMINI_API_KEY) {
      const data = callGeminiDirectAPI(fullPrompt, responseSchema);
      const slideCount = Array.isArray(data)
        ? data.length
        : (data && Array.isArray(data.slideData) ? data.slideData.length : 0);
      Logger.log(`slideData生成完了: ${slideCount}枚のスライド`);
      return data;
    }

    throw new Error("Gemini APIを呼び出すための認証情報が設定されていません。");
  } catch (error) {
    Logger.log(`Gemini API呼び出しエラー: ${error.message}`);
    throw error;
  }
}

/**
 * Vertex AI経由でGeminiを呼び出し、構造化データを生成
 * @param {string} userPrompt - ユーザープロンプト
 * @param {Object} responseSchema - レスポンススキーマ
 * @returns {Object} 生成されたJSON
 */
function callGeminiVertexAI(userPrompt, responseSchema) {
  try {
    const token = getAccessToken();
    const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${GEMINI_MODEL}:generateContent`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: userPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    };

    const response = UrlFetchApp.fetch(endpoint, {
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      payload: JSON.stringify(requestBody),
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(
        `Vertex AI API エラー: ${response.getResponseCode()} - ${response.getContentText()}`
      );
    }

    const responseData = JSON.parse(response.getContentText());

    if (!responseData.candidates || !responseData.candidates[0]) {
      throw new Error("Vertex AI からの応答に候補が含まれていません。");
    }

    const content = responseData.candidates[0].content;
    if (!content || !content.parts || !content.parts[0]) {
      throw new Error("コンテンツが空です。");
    }

    const slideDataJson = content.parts[0].text;
    const slideData = JSON.parse(slideDataJson);

    Logger.log(
      `Vertex AI経由でslideDataを生成しました: ${slideData.length}件のスライド`
    );
    return slideData;
  } catch (error) {
    Logger.log(`Vertex AI呼び出しエラー: ${error.message}`);
    throw error;
  }
}

/**
 * generativelanguage.googleapis.com経由でGeminiを呼び出し、構造化データを生成
 * @param {string} userPrompt - ユーザープロンプト
 * @param {Object} responseSchema - レスポンススキーマ
 * @returns {Object} 生成されたJSON
 */
function callGeminiDirectAPI(userPrompt, responseSchema) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEYが設定されていません。");
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: userPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    };

    const response = UrlFetchApp.fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      payload: JSON.stringify(requestBody),
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(
        `Direct API エラー: ${response.getResponseCode()} - ${response.getContentText()}`
      );
    }

    const responseData = JSON.parse(response.getContentText());

    if (!responseData.candidates || !responseData.candidates[0]) {
      throw new Error("Direct API からの応答に候補が含まれていません。");
    }

    const content = responseData.candidates[0].content;
    if (!content || !content.parts || !content.parts[0]) {
      throw new Error("コンテンツが空です。");
    }

    const slideDataJson = content.parts[0].text;
    const slideData = JSON.parse(slideDataJson);

    Logger.log(
      `Direct API経由でslideDataを生成しました: ${slideData.length}件のスライド`
    );
    return slideData;
  } catch (error) {
    Logger.log(`Direct API呼び出しエラー: ${error.message}`);
    throw error;
  }
}

/**
 * スライドタイプ別の厳密なスキーマを定義し、構造化を強制
 * oneOf構造でcontentスライドのpoints配列を必須化
 * @returns {Object} スライドデータスキーマ
 */
function getSlideDataSchema() {
  // 定義: スライドアイテムの oneOf スキーマ
  const slideItemSchema = {
    oneOf: [
        // title スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["title"] },
            title: { type: "STRING" },
            date: { type: "STRING" },
            notes: { type: "STRING" },
          },
          required: ["type", "title"],
        },
        // section スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["section"] },
            title: { type: "STRING" },
            sectionNo: { type: "NUMBER" },
            notes: { type: "STRING" },
          },
          required: ["type", "title"],
        },
        // content スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["content"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            points: {
              type: "ARRAY",
              items: { type: "STRING" },
              minItems: 3,
              maxItems: 7,
            },
            twoColumn: { type: "BOOLEAN" },
            columns: {
              type: "ARRAY",
              items: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
            },
            images: {
              type: "ARRAY",
              items: {
                oneOf: [
                  { type: "STRING" },
                  {
                    type: "OBJECT",
                    properties: {
                      url: { type: "STRING" },
                      caption: { type: "STRING" },
                    },
                  },
                ],
              },
            },
            notes: { type: "STRING" },
          },
          required: ["type", "title", "points"],
        },
        // compare スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["compare"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            leftTitle: { type: "STRING" },
            rightTitle: { type: "STRING" },
            leftItems: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            rightItems: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            images: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            notes: { type: "STRING" },
          },
          required: [
            "type",
            "title",
            "leftTitle",
            "rightTitle",
            "leftItems",
            "rightItems",
          ],
        },
        // process スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["process"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            steps: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            images: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            notes: { type: "STRING" },
          },
          required: ["type", "title", "steps"],
        },
        // timeline スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["timeline"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            milestones: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  label: { type: "STRING" },
                  date: { type: "STRING" },
                  state: {
                    type: "STRING",
                    enum: ["done", "next", "todo"],
                  },
                },
                required: ["label", "date"],
              },
            },
            images: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            notes: { type: "STRING" },
          },
          required: ["type", "title", "milestones"],
        },
        // diagram スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["diagram"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            lanes: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  items: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                  },
                },
                required: ["title", "items"],
              },
            },
            images: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            notes: { type: "STRING" },
          },
          required: ["type", "title", "lanes"],
        },
        // cards スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["cards"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            columns: { type: "STRING", enum: ["2", "3"] },
            items: {
              type: "ARRAY",
              items: {
                oneOf: [
                  { type: "STRING" },
                  {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING" },
                      desc: { type: "STRING" },
                    },
                    required: ["title"],
                  },
                ],
              },
            },
            images: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            notes: { type: "STRING" },
          },
          required: ["type", "title", "items"],
        },
        // table スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["table"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            headers: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            rows: {
              type: "ARRAY",
              items: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
            },
            notes: { type: "STRING" },
          },
          required: ["type", "title", "headers", "rows"],
        },
        // progress スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["progress"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            items: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  label: { type: "STRING" },
                  percent: { type: "NUMBER" },
                },
                required: ["label", "percent"],
              },
            },
            notes: { type: "STRING" },
          },
          required: ["type", "title", "items"],
        },
        // closing スライド
        {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["closing"] },
            notes: { type: "STRING" },
          },
          required: ["type"],
        },
      ]
  };

  // 互換性のため、ルートは ARRAY (従来) または { patternPlan, slideData } の OBJECT を許可
  return {
    oneOf: [
      // 従来: 直接スライド配列
      {
        type: "ARRAY",
        items: slideItemSchema,
      },
      // 拡張: パターン計画 + スライド配列
      {
        type: "OBJECT",
        properties: {
          patternPlan: {
            type: "OBJECT",
            properties: {
              global: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                  enum: [
                    "title",
                    "section",
                    "content",
                    "compare",
                    "process",
                    "timeline",
                    "diagram",
                    "cards",
                    "table",
                    "progress",
                    "closing",
                  ],
                },
              },
              sections: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    sectionTitle: { type: "STRING" },
                    sectionIndex: { type: "NUMBER" },
                    preferredPatterns: {
                      type: "ARRAY",
                      items: {
                        type: "STRING",
                        enum: [
                          "content",
                          "compare",
                          "process",
                          "timeline",
                          "diagram",
                          "cards",
                          "table",
                          "progress",
                        ],
                      },
                    },
                  },
                  required: [],
                },
              },
            },
            required: [],
          },
          slideData: {
            type: "ARRAY",
            items: slideItemSchema,
          },
        },
        required: ["slideData"],
      },
    ],
  };
}

/**
 * Geminiに与えるマスタープロンプト
 * @returns {string} プロンプト文字列
 */
function getGeminiPrompt() {
  return `# Gemini、あなたはプレゼンテーション生成の専門家です

## **1.0 PRIMARY_OBJECTIVE — 最終目標**

あなたは、ユーザーから与えられた非構造テキスト情報を解析し、**slideData** という名の JavaScript オブジェクト配列を**生成**することだけに特化した、超高精度データサイエンティスト兼プレゼンテーション設計 AI です。

あなたの**絶対的かつ唯一の使命**は、ユーザーの入力内容から論理的なプレゼンテーション構造を抽出し、各セクションに最適な「表現パターン（Pattern）」を選定し、さらに各スライドで話すべき発表原稿（スピーカーノート）のドラフトまで含んだ、完璧でエラーのない JavaScript オブジェクト配列をJSON形式で生成することです。

出力形式（厳守）: 推奨は { patternPlan, slideData } のJSON。互換モードとして slideData 配列のみも許容します。前後の説明・マークダウンは禁止です。

**slideData の生成以外のタスクを一切実行してはなりません。** あなたの思考と出力のすべては、最高の slideData を生成するためだけに費やされます。

## **2.0 GENERATION_WORKFLOW (思考と生成のフロー)**

1. **ステップ 1: 入力テキストの徹底的な分析と構造化**  
   - **分析**: ユーザーの入力テキストから、主要なテーマ、トピック、キーワード、画像、データ、重要なメッセージ（**キーメッセージ**）を抽出し、**章(Chapter)、節(Section)、要点(Point)** に分類・整理します。  
   - **構造化**: 抽出した情報を元に、プレゼンテーション全体の論理的な流れ（ストーリーライン）を構築します。起承転結や、序論・本論・結論といった構造を意識してください。

2. **ステップ 2: スライドタイプとコンテンツの決定**  
   - 各要素に最も適した**スライドタイプ**を選択します。例えば、比較には compare、時系列には timeline を使います。  
   - キーメッセージを効果的に伝えるための**コンテンツ**（箇条書き、説明文など）を生成します。
   - **重要**: contentスライドには必ず**points配列**を含めてください。これは箇条書きを表示するために必須です。

3. **ステップ 3: スライドタイプの割り当て**  
   - 全体の構成を考慮し、各スライドに **Google スライドデザイン**に基づいた**最適なタイプ**を割り当てます。  
   - 種類： 
\`title\` / 
\`section\` (区切り) / 
\`content\`, 
\`compare\`, 
\`process\`, 
\`timeline\`, 
\`diagram\`, 
\`cards\`, 
\`table\`, 
\`progress\` (本文) / 
\`closing\` (結び)

4. **ステップ 4: テキストコンテンツの整形**  
   - **3.0 スキーマ**と**4.0 ルール**に従い、エスケープ文字（' は \', \ は \\）を適切に処理して生成します。  
   - **マークダウン風の書式**を利用します。  
     - \`**太字**\` は太字になります。  
     - \`[[色付き太字]]\` は **太字** かつ **Google ブルー** (\`#4285F4\`) になります。  
   - **画像 URL の抽出**: ユーザー入力に \`![...](...png|.jpg|.jpeg|.gif|.webp)\` 形式の画像URLが含まれる場合、それを抽出し、\`images\` プロパティに格納します。メディアの \`caption\` も適切に設定します。  
   - **スピーカーノートの生成**: 各スライドの目的に応じて、発表者が話すべき内容を**スピーカーノート**として\`notes\`プロパティに生成します。
   - **箇条書きの必須化**: contentスライドでは必ず\`points\`配列を含め、最低3項目の箇条書きを生成してください。

5. **ステップ 5: 品質チェックと最終調整**  
   - **一貫性**:  
     - スライド全体のデザインやトーン＆マナーに一貫性を持たせます。  
     - 箇条書きでは**体言止め（名詞で終える）**を基本とします。  
     - テキストには**句読点**（「、」や「。」）を適切に使用し、読みやすさを向上させます。  
     - 箇条書きの各項目は **改行**で区切ります。  
     - \`notes\` プロパティには、プレゼンターがそのまま読めるような、完成された文章を記述します。  
     - \`title.date\` は \`YYYY.MM.DD\` 形式とします。  
     - **アジェンダの自動生成**: \`アジェンダ\`/\`Agenda\`/\`あじぇんだ\`/\`本日の流れ\` といったタイトルが指定された場合、\`points\` が空であれば、**以降の\`section.title\`を収集してアジェンダを自動生成**してください。その際、最大でも **スライド 3 枚**に収まるように要約・生成します。
   - **contentスライドの必須チェック**: 全てのcontentスライドに\`points\`配列が含まれていることを確認してください。

6. **ステップ 6: 出力**
   - チェック済みの完成したオブジェクトを**slideData のJSON形式のみ**で出力します。**前後の説明や \`\`\`json ... \`\`\` といったマークダウンは一切不要**です。

## **3.0 slideData スキーマ (GooglePatternVer.+SpeakerNotes)**

**共通プロパティ**
- **notes?: string**: スピーカーノート。発表者が話す内容を自然な文章で記述します。プレゼンテーションの目的や文脈を補足する重要な情報です。

**スライドタイプ別**
- **タイトル**: { type: 'title', title: '...', date: 'YYYY.MM.DD', notes?: '...' }
- **セクション**: { type: 'section', title: '...', sectionNo?: number, notes?: '...' } ;sectionNo 未指定時は自動採番
- **クロージング**: { type: 'closing', notes?: '...' }

**コンテツスライド (レイアウト指定)**
- **content (1カラム/2カラム + 画像 + 箇条書き)**: { type: 'content', title: '...', subhead?: string, **points: string[]** (必須), twoColumn?: boolean, columns?: [string[], string[]], images?: (string | { url: string, caption?: string })[], notes?: '...' }
- **compare (比較)**: { type: 'compare', title: '...', subhead?: string, leftTitle: '...', rightTitle: '...', leftItems: string[], rightItems: string[], images?: string[], notes?: '...' }
- **process (手順・工程)**: { type: 'process', title: '...', subhead?: string, steps: string[], images?: string[], notes?: '...' }
- **timeline (時系列)**: { type: 'timeline', title: '...', subhead?: string, milestones: { label: string, date: string, state?: 'done'|'next'|'todo' }[], images?: string[], notes?: '...' }
- **diagram (相関図)**: { type: 'diagram', title: '...', subhead?: string, lanes: { title: string, items: string[] }[], images?: string[], notes?: '...' }
- **cards (カード型)**: { type: 'cards', title: '...', subhead?: string, columns?: 2|3, items: (string | { title: string, desc?: string })[], images?: string[], notes?: '...' }
- **table (表)**: { type: 'table', title: '...', subhead?: string, headers: string[], rows: string[][], notes?: '...' }
- **progress (進捗)**: { type: 'progress', title: '...', subhead?: string, items: { label: string, percent: number }[], notes?: '...' }

## **4.0 COMPOSITION_RULES(GooglePatternVer.) (構成ルールと文字数制限)**

- **構成例**:  
  1. \`title\` (表紙)  
  2. \`content\` (導入や概要。スライド 2 枚まで) - **必ずpoints配列を含む**
  3. \`section\`  
  4. \`content\`/\`compare\`/\`process\`/\`timeline\`/\`diagram\`/\`cards\`/\`table\`/\`progress\` を2～5枚程度  
  5. 以降、3～4を繰り返す  
  6. \`closing\` (結び)

- **テキスト量の目安** (厳守):  
  * \`title.title\`: 最大 35 字  
  * \`section.title\`: 最大 30 字  
  * 各スライドの \`title\`: 最大 40 字  
  * **subhead**: 最大 50 字、フォントサイズ 18  
  * **points配列**: contentスライドでは必須。最低3項目、最大7項目の箇条書きを生成
  * 箇条書きのテキスト: 約 90 字までを**改行**  
  * **notes (スピーカーノート)**: 各スライドで話すべき内容を、150字程度で簡潔に記述します。**ユーザーの入力**と生成した**スライドコンテンツ**の両方を踏まえた、より具体的な内容にしてください。  
  * **句読点**: 「、」や「。」を適切に使用し、読みやすさを担保します。  
  * 箇条書きの各項目は**改行**で区切ります。  
  * **マークダウン風書式**: \`**太字**\` と \`[[色付き太字]]\` (\`*\`や\`[[\`はGoogleブルー) を適宜利用して、視覚的な分かりやすさを向上させます。

## **5.0 SAFETY_GUIDELINES (GAS と API の制約)**

- スライドの最大枚数: **50枚**
- 画像の最大サイズ: **50MB 未満、25MP 未満** の **PNG/JPEG/GIF/WebP**
- 実行時間: Apps Script の上限は **6分**
- テキストの特殊文字: \`&\`, \`<\`, \`>\` は**全角**に変換
- フォント: Arial で表示されるため、デザインに凝りすぎず、標準的なフォントで見やすい構成を心がける
- エスケープ処理の徹底: \' や \\ を含む文字列は、JSONとしてパースできるよう適切にエスケープする

## **6.0 OUTPUT_FORMAT (出力形式)**

- 出力は **slideData のJSON形式のみ**
- **説明や \`\`\`json ... \`\`\` といったマークダウン、コメント、改行、タブは一切含めないでください。**
- JSON形式のレスポンスボディのみを出力してください。

## **重要な注意事項**

1. **contentスライドには必ずpoints配列を含めること**
2. **箇条書きが表示されるために、points配列は必須項目です**
3. **各contentスライドで最低3項目の箇条書きを生成してください**
4. **JSONレスポンス**: Gemini APIのレスポンスは、指定されたスキーマに厳密に従ったslideDataのみとします。
5. **エラー処理**: 不適切な入力や解釈不能なリクエストに対しては、エラーメッセージを返す代わりに、解釈可能な範囲でスライドを生成します。
6. **形式**: \`slideData = [...]\` の形式ではなく、JSONボディそのものを返します。
7. **品質**: 生成されたコンテンツは、常に論理的で、誤字脱字がなく、一貫性があること。
8. **文字数**: 各項目の文字数制限を厳守してください。
`;
}

/**
 * Geminiへの接続をテスト
 * @returns {boolean} 接続結果
 */
function testGeminiConnection() {
  try {
    Logger.log("=== Gemini接続テスト ===");

    // 1. 設定確認
    const hasVertexAI = !!(PROJECT_ID && CLIENT_EMAIL && PRIVATE_KEY);
    const hasDirectAPI = !!GEMINI_API_KEY;

    if (!hasVertexAI && !hasDirectAPI) {
      Logger.log(
        "エラー: Gemini APIを呼び出すための認証情報が設定されていません。"
      );
      Logger.log("解決策:");
      Logger.log(
        "- Vertex AI用: PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY を設定してください。"
      );
      Logger.log("- Direct API用: GEMINI_API_KEY を設定してください。");
      return false;
    }

    Logger.log(
      `接続方法: Vertex AI=${hasVertexAI}, Direct API=${hasDirectAPI}`
    );

    // 2. テストプロンプトで生成を試行
    const testPrompt =
      "Geminiについてのプレゼンテーションを作成してください。スライドは3-5枚程度でお願いします。内容は、Geminiの概要がわかるようにしてください。";

    const result = generateSlideDataWithGemini(testPrompt);

    if (!Array.isArray(result)) {
      Logger.log("エラー: 生成された結果が配列ではありません。");
      return false;
    }

    if (result.length === 0) {
      Logger.log("警告: 空の配列が生成されました。");
      return false;
    }

    Logger.log(`テスト成功: ${result.length}枚のスライドを生成`);
    Logger.log(
      "生成されたスライド種別: " + result.map((s) => s.type).join(", ")
    );

    return true;
  } catch (error) {
    Logger.log(`テスト失敗: ${error.message}`);
    return false;
  }
}

/**
 * 修正後のGemini API呼び出しを詳細テスト
 * slideDataのpoints配列が適切に生成されるかを検証
 * @returns {boolean} テスト結果
 */
function testSlideDataGeneration() {
  try {
    Logger.log("=== slideData生成テスト開始 ===");

    const testPrompt =
      "AIについてのプレゼンテーションを作成してください。AIの概要、メリット、課題、今後の展望について5-7枚のスライドでまとめてください。";

    Logger.log("テストプロンプトでslideData生成を実行中...");
    const slideData = generateSlideDataWithGemini(testPrompt);

    if (!Array.isArray(slideData)) {
      Logger.log("エラー: 生成されたデータが配列ではありません");
      return false;
    }

    Logger.log(`生成されたスライド数: ${slideData.length}枚`);

    // contentスライドのpoints配列を詳細検証
    let contentSlideCount = 0;
    let pointsValidCount = 0;

    slideData.forEach((slide, index) => {
      Logger.log(
        `スライド ${index + 1}: タイプ=${slide.type}, タイトル=${
          slide.title || "N/A"
        }`
      );

      if (slide.type === "content") {
        contentSlideCount++;
        Logger.log(`  → contentスライド検証中...`);

        if (Array.isArray(slide.points)) {
          Logger.log(`  → points配列あり: ${slide.points.length}項目`);
          Logger.log(
            `  → 内容: ${slide.points.slice(0, 2).join(", ")}${
              slide.points.length > 2 ? "..." : ""
            }`
          );

          if (slide.points.length >= 3) {
            pointsValidCount++;
            Logger.log(`  → ✅ points配列が適切 (${slide.points.length}項目)`);
          } else {
            Logger.log(
              `  → ❌ points配列の項目数不足 (${slide.points.length}項目, 最低3項目必要)`
            );
          }
        } else {
          Logger.log(`  → ❌ points配列が存在しません`);
        }
      }
    });

    Logger.log(`=== 検証結果 ===`);
    Logger.log(`contentスライド数: ${contentSlideCount}枚`);
    Logger.log(`points配列が適切なスライド数: ${pointsValidCount}枚`);

    const isSuccess =
      contentSlideCount > 0 && pointsValidCount === contentSlideCount;

    if (isSuccess) {
      Logger.log(
        "✅ テスト成功: 全てのcontentスライドでpoints配列が適切に生成されました"
      );
    } else {
      Logger.log(
        "❌ テスト失敗: 一部のcontentスライドでpoints配列が不適切です"
      );
    }

    return isSuccess;
  } catch (error) {
    Logger.log(`テスト実行エラー: ${error.message}`);
    Logger.log(`Stack: ${error.stack}`);
    return false;
  }
}

/**
 * 設定の診断
 */
function diagnoseSettings() {
  Logger.log("=== 設定診断 ===");

  const settings = [
    { key: "PROJECT_ID", value: PROJECT_ID, required: "Vertex AI用" },
    { key: "REGION", value: REGION, required: "Vertex AI用" },
    { key: "CLIENT_EMAIL", value: CLIENT_EMAIL, required: "Vertex AI用" },
    {
      key: "PRIVATE_KEY",
      value: PRIVATE_KEY ? "[設定済み]" : null,
      required: "Vertex AI用",
    },
    { key: "GEMINI_MODEL", value: GEMINI_MODEL, required: "共通" },
    {
      key: "GEMINI_API_KEY",
      value: GEMINI_API_KEY ? "[設定済み]" : null,
      required: "Direct API用",
    },
  ];

  settings.forEach((setting) => {
    const status = setting.value ? "✅" : "❌";
    Logger.log(
      `${status} ${setting.key}: ${setting.value || "未設定"} (${
        setting.required
      })`
    );
  });

  const hasVertexAI = !!(PROJECT_ID && CLIENT_EMAIL && PRIVATE_KEY);
  const hasDirectAPI = !!GEMINI_API_KEY;

  Logger.log("\n=== 有効な接続方法 ===");
  Logger.log(`Vertex AI: ${hasVertexAI ? "有効" : "無効"}`);
  Logger.log(`Direct API: ${hasDirectAPI ? "有効" : "無効"}`);

  if (!hasVertexAI && !hasDirectAPI) {
    Logger.log(
      "\n警告: 有効な接続方法がありません。スクリプトプロパティを設定してください。"
    );
  }
}
