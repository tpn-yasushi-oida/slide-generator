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
    console.log("=== Gemini API slideData生成開始 ===");
    console.log("📝 ユーザー入力データ:", userPrompt);
    Logger.log("Gemini APIでslideData生成開始");

    // プロンプト作成
    const fullPrompt = getGeminiPrompt() + "\n\n" + userPrompt;
    const responseSchema = getSlideDataSchema();

    console.log("🎯 最終プロンプト:", fullPrompt);
    console.log("📋 JSONスキーマ:", JSON.stringify(responseSchema, null, 2));

    // 優先: Vertex AI を利用
    if (PROJECT_ID && CLIENT_EMAIL && PRIVATE_KEY) {
      try {
        console.log("🚀 Vertex AI経由で呼び出し開始");
        const slideData = callGeminiVertexAI(fullPrompt, responseSchema);
        console.log("✅ slideData生成完了:", slideData);
        console.log("📊 生成されたスライド数:", slideData.length);
        Logger.log(`slideData生成完了: ${slideData.length}枚のスライド`);
        return slideData;
      } catch (vertexError) {
        console.error("❌ Vertex AI呼び出しエラー:", vertexError);
        Logger.log(`Vertex AI呼び出しに失敗: ${vertexError.message}`);
        Logger.log("代替手段: generativelanguage.googleapis.com を試します。");
      }
    }

    // 代替手段: generativelanguage.googleapis.com
    if (GEMINI_API_KEY) {
      console.log("🚀 Direct API経由で呼び出し開始");
      const slideData = callGeminiDirectAPI(fullPrompt, responseSchema);
      console.log("✅ slideData生成完了:", slideData);
      console.log("📊 生成されたスライド数:", slideData.length);
      Logger.log(`slideData生成完了: ${slideData.length}枚のスライド`);
      return slideData;
    }

    throw new Error("Gemini APIを呼び出すための認証情報が設定されていません。");
  } catch (error) {
    console.error("💥 Gemini API呼び出し失敗:", error);
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
    console.log("🔧 Vertex AI: アクセストークン取得中...");
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
        temperature: 0.2,
        topP: 0.6,
        topK: 40,
      },
    };

    console.log("📤 Vertex AI: リクエスト送信中...", {
      endpoint,
      requestBodySize: JSON.stringify(requestBody).length,
      generationConfig: requestBody.generationConfig,
    });

    const response = UrlFetchApp.fetch(endpoint, {
      method: "POST",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + token },
      payload: JSON.stringify(requestBody),
      muteHttpExceptions: true,
    });

    console.log("📥 Vertex AI: レスポンス受信", {
      statusCode: response.getResponseCode(),
      responseSize: response.getContentText().length,
    });

    if (response.getResponseCode() !== 200) {
      const errorText = response.getContentText();
      console.error("❌ Vertex AI APIエラー:", errorText);
      throw new Error(
        `Vertex AI API エラー: ${response.getResponseCode()} - ${errorText}`
      );
    }

    const responseData = JSON.parse(response.getContentText());
    console.log("🔍 Vertex AI: 完全なレスポンス:", responseData);

    if (!responseData.candidates || !responseData.candidates[0]) {
      console.error("❌ Vertex AI: 候補が見つかりません", responseData);
      throw new Error("Vertex AI からの応答に候補が含まれていません。");
    }

    const content = responseData.candidates[0].content;
    if (!content || !content.parts || !content.parts[0]) {
      console.error("❌ Vertex AI: コンテンツが空です", content);
      throw new Error("コンテンツが空です。");
    }

    const slideDataJson = content.parts[0].text;
    console.log("📄 Vertex AI: 生のJSONレスポンス:", slideDataJson);

    const slideData = JSON.parse(slideDataJson);
    console.log("✨ Vertex AI: パース済みslideData:", slideData);

    Logger.log(
      `Vertex AI経由でslideDataを生成しました: ${slideData.length}件のスライド`
    );
    return slideData;
  } catch (error) {
    console.error("💥 Vertex AI呼び出しエラー:", error);
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
      console.error("❌ Direct API: API KEYが設定されていません");
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

    console.log("📤 Direct API: リクエスト送信中...", {
      endpoint,
      requestBodySize: JSON.stringify(requestBody).length,
      generationConfig: requestBody.generationConfig,
    });

    const response = UrlFetchApp.fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      payload: JSON.stringify(requestBody),
    });

    console.log("📥 Direct API: レスポンス受信", {
      statusCode: response.getResponseCode(),
      responseSize: response.getContentText().length,
    });

    if (response.getResponseCode() !== 200) {
      const errorText = response.getContentText();
      console.error("❌ Direct API エラー:", errorText);
      throw new Error(
        `Direct API エラー: ${response.getResponseCode()} - ${errorText}`
      );
    }

    const responseData = JSON.parse(response.getContentText());
    console.log("🔍 Direct API: 完全なレスポンス:", responseData);

    if (!responseData.candidates || !responseData.candidates[0]) {
      console.error("❌ Direct API: 候補が見つかりません", responseData);
      throw new Error("Direct API からの応答に候補が含まれていません。");
    }

    const content = responseData.candidates[0].content;
    if (!content || !content.parts || !content.parts[0]) {
      console.error("❌ Direct API: コンテンツが空です", content);
      throw new Error("コンテンツが空です。");
    }

    const slideDataJson = content.parts[0].text;
    console.log("📄 Direct API: 生のJSONレスポンス:", slideDataJson);

    const slideData = JSON.parse(slideDataJson);
    console.log("✨ Direct API: パース済みslideData:", slideData);

    Logger.log(
      `Direct API経由でslideDataを生成しました: ${slideData.length}件のスライド`
    );
    return slideData;
  } catch (error) {
    console.error("💥 Direct API呼び出しエラー:", error);
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
  return {
    type: "ARRAY",
    title: "slideData",
    items: {
      anyOf: [
        {
          type: "OBJECT",
          description: "表紙スライド",
          properties: {
            type: { type: "STRING", enum: ["title"] },
            title: { type: "STRING" },
            date: { type: "STRING" },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type", "title", "date"],
          propertyOrdering: ["type", "title", "date", "notes", "classifier"],
        },
        {
          type: "OBJECT",
          description: "章扉",
          properties: {
            type: { type: "STRING", enum: ["section"] },
            title: { type: "STRING" },
            sectionNo: { type: "INTEGER" },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type", "title"],
          propertyOrdering: [
            "type",
            "title",
            "sectionNo",
            "notes",
            "classifier",
          ],
        },
        {
          type: "OBJECT",
          description: "クロージング",
          properties: {
            type: { type: "STRING", enum: ["closing"] },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type"],
          propertyOrdering: ["type", "notes", "classifier"],
        },
        {
          type: "OBJECT",
          description:
            "汎用コンテンツ（※他型に該当しない場合のフォールバック）",
          properties: {
            type: { type: "STRING", enum: ["content"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            points: { type: "ARRAY", items: { type: "STRING" } },
            twoColumn: { type: "BOOLEAN" },
            columns: {
              type: "ARRAY",
              items: { type: "ARRAY", items: { type: "STRING" } },
            },
            images: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  url: { type: "STRING" },
                  caption: { type: "STRING" },
                },
                required: ["url"],
              },
            },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type", "title"],
          propertyOrdering: [
            "type",
            "title",
            "subhead",
            "points",
            "twoColumn",
            "columns",
            "images",
            "notes",
            "classifier",
          ],
        },
        {
          type: "OBJECT",
          description: "対比（vs/比較/メリデメなどの信号があるときに選択）",
          properties: {
            type: { type: "STRING", enum: ["compare"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            leftTitle: { type: "STRING" },
            rightTitle: { type: "STRING" },
            leftItems: { type: "ARRAY", items: { type: "STRING" } },
            rightItems: { type: "ARRAY", items: { type: "STRING" } },
            images: { type: "ARRAY", items: { type: "STRING" } },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: [
            "type",
            "title",
            "leftTitle",
            "rightTitle",
            "leftItems",
            "rightItems",
          ],
          propertyOrdering: [
            "type",
            "title",
            "subhead",
            "leftTitle",
            "rightTitle",
            "leftItems",
            "rightItems",
            "images",
            "notes",
            "classifier",
          ],
        },
        {
          type: "OBJECT",
          description: "工程/手順（STEP/1.2.3.やフローの信号）",
          properties: {
            type: { type: "STRING", enum: ["process"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            steps: { type: "ARRAY", items: { type: "STRING" } },
            images: { type: "ARRAY", items: { type: "STRING" } },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type", "title", "steps"],
          propertyOrdering: [
            "type",
            "title",
            "subhead",
            "steps",
            "images",
            "notes",
            "classifier",
          ],
        },
        {
          type: "OBJECT",
          description: "時系列（年月/四半期/ロードマップ等の信号）",
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
                  state: { type: "STRING", enum: ["done", "next", "todo"] },
                },
                required: ["label", "date"],
                propertyOrdering: ["label", "date", "state"],
              },
            },
            images: { type: "ARRAY", items: { type: "STRING" } },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type", "title", "milestones"],
          propertyOrdering: [
            "type",
            "title",
            "subhead",
            "milestones",
            "images",
            "notes",
            "classifier",
          ],
        },
        {
          type: "OBJECT",
          description: "レーン図（関係/構成/依存/連携の信号）",
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
                  items: { type: "ARRAY", items: { type: "STRING" } },
                },
                required: ["title", "items"],
                propertyOrdering: ["title", "items"],
              },
            },
            images: { type: "ARRAY", items: { type: "STRING" } },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type", "title", "lanes"],
          propertyOrdering: [
            "type",
            "title",
            "subhead",
            "lanes",
            "images",
            "notes",
            "classifier",
          ],
        },
        {
          type: "OBJECT",
          description:
            "カードグリッド（同型の要素が多数：機能一覧/事例/メンバー）",
          properties: {
            type: { type: "STRING", enum: ["cards"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            columnsCount: { type: "INTEGER", description: "2 または 3 を推奨" },
            items: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  desc: { type: "STRING" },
                },
                required: ["title"],
                propertyOrdering: ["title", "desc"],
              },
            },
            images: { type: "ARRAY", items: { type: "STRING" } },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type", "title", "items"],
          propertyOrdering: [
            "type",
            "title",
            "subhead",
            "columnsCount",
            "items",
            "images",
            "notes",
            "classifier",
          ],
        },
        {
          type: "OBJECT",
          description: "表（マトリクスや比較表が自然なとき）",
          properties: {
            type: { type: "STRING", enum: ["table"] },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            headers: { type: "ARRAY", items: { type: "STRING" } },
            rows: {
              type: "ARRAY",
              items: { type: "ARRAY", items: { type: "STRING" } },
            },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type", "title", "headers", "rows"],
          propertyOrdering: [
            "type",
            "title",
            "subhead",
            "headers",
            "rows",
            "notes",
            "classifier",
          ],
        },
        {
          type: "OBJECT",
          description: "進捗（%・ステータスの信号）",
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
                  percent: {
                    type: "NUMBER",
                    description: "0〜100（範囲は説明のみで緩く拘束）",
                  },
                },
                required: ["label", "percent"],
                propertyOrdering: ["label", "percent"],
              },
            },
            notes: { type: "STRING" },
            classifier: {
              type: "OBJECT",
              properties: {
                signals: { type: "ARRAY", items: { type: "STRING" } },
                rationale: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
            },
          },
          required: ["type", "title", "items"],
          propertyOrdering: [
            "type",
            "title",
            "subhead",
            "items",
            "notes",
            "classifier",
          ],
        },
      ],
    },
  };
}

/**
 * Geminiに与えるマスタープロンプト
 * @returns {string} プロンプト文字列
 */
function getGeminiPrompt() {
  return `## **1.0 PRIMARY_OBJECTIVE — 最終目標**

あなたは、ユーザーから与えられた非構造テキスト情報を解析し、後述する **【GOOGLE_TEMPLATE_BLUEPRINT】** で定義された仕様に準拠し、**slideData** という名の **JSON 配列（= JavaScript オブジェクト配列）** を**生成**することだけに特化した、超高精度データサイエンティスト兼プレゼンテーション設計AIです。

あなたの**絶対的かつ唯一の使命**は、ユーザーの入力内容から論理的なプレゼンテーション構造を抽出し、各セクションに最適な「表現パターン（Pattern）」を選定し、さらに各スライドで話すべき発表原稿（スピーカーノート）のドラフトまで含んだ、**slideData**（配列）を**完全かつエラーなく生成**することです。

**slideData の生成以外のタスクを一切実行してはなりません。** 既存のロジック、デザイン設定、命名（関数名・変数名）など、あなたが影響を与えることは固く禁じられています。あなたの思考と出力のすべては、最高の slideData を生成するためだけに費やされます。

## **2.0 GENERATION_WORKFLOW — 厳守すべき思考と生成のプロセス**

1. **【ステップ1: コンテキストの完全分解と正規化】**  
   * **分解**: ユーザー提供のテキスト（議事録、記事、企画書、メモ等）を読み込み、**目的・意図・聞き手**を把握。内容を「**章（Chapter）→ 節（Section）→ 要点（Point）**」の階層に内部マッピング。  
   * **正規化**: 入力前処理を自動実行。（タブ→スペース、連続スペース→1つ、スマートクォート→ASCIIクォート、改行コード→LF、用語統一）  
2. **【ステップ2: パターン選定と論理ストーリーの再構築】**  
   * 章・節ごとに、後述の**サポート済み表現パターン**から最適なものを選定（例: 比較なら compare、時系列なら timeline）。  
   * 聞き手に最適な**説得ライン**（問題解決型、PREP法、時系列など）へ再配列。  
   * **【パターン判定ヒューリスティクス（促進）】**  
     * **compare**: 「vs / 比較 / 対比 / メリット・デメリット / 長所・短所 / 左右で並列」などの語や構造がある場合  
     * **process**: 「手順 / 工程 / フロー / STEP / 1. 2. 3. / →で連鎖」など段階列挙の痕跡がある場合  
     * **timeline**: 「YYYY-MM / YYYY年 / Q1〜Q4 / スケジュール / ロードマップ / 期日」など日時・時系列語が多い場合  
     * **diagram**: 「関係 / 体系 / 構成 / 依存 / 連携 / データフロー」など関係性整理が主題の場合  
     * **cards**: 同型フォーマットの項目が多数（例: 機能一覧・事例集・メンバー紹介等）で2〜3列配置が適する場合  
     * **table**: 列・行のマトリクス（CSV/TSV様式、ヘッダ＋複数行）や比較表が自然な場合  
     * **progress**: 進捗・達成率（%）・ステータス（done/next/todo）指標が主題の場合  
     * **content** は**他のいずれにも該当しない場合のフォールバック**とする  
3. **【ステップ3: スライドタイプへのマッピング】**  
   * ストーリー要素を **Googleパターン・スキーマ**に**最適割当**。  
   * 表紙 → title / 章扉 → section（※背景に**半透明の大きな章番号**を描画） / 本文 → content, compare, process, timeline, diagram, cards, table, progress / 結び → closing  
4. **【ステップ4: オブジェクトの厳密な生成】**  
   * **3.0 スキーマ**と**4.0 ルール**に準拠し、文字列をエスケープ（' → \', \\ → \\）して1件ずつ生成。  
   * **インライン強調記法**を使用可：  
     * **太字** → 太字  
     * [[重要語]] → **太字＋Googleブルー**（#4285F4）  
   * **画像URLの抽出**: 入力テキスト内の ![](…png|.jpg|.jpeg|.gif|.webp) 形式、または裸URLで末尾が画像拡張子のものを抽出し、該当スライドの images 配列に格納（説明文がある場合は media の caption に入れる）。  
   * **スピーカーノート生成**: 各スライドの内容に基づき、発表者が話すべき内容の**ドラフトを生成**し、notesプロパティに格納する。  
5. **【ステップ5: 自己検証と反復修正】**  
   * **チェックリスト**:  
     * 文字数・行数・要素数の上限遵守（各パターンの規定に従うこと）  
     * 箇条書き要素に**改行（\n）を含めない**  
     * テキスト内に**禁止記号**（■ / →）を含めない（※装飾・矢印は描画ロジック側で処理）  
     * 箇条書き文末に **句点「。」を付けない**（体言止め推奨）  
     * notesプロパティが各スライドに適切に設定されているか確認  
     * title.dateはYYYY.MM.DD形式  
     * **アジェンダ安全装置**: 「アジェンダ/Agenda/目次/本日お伝えすること」等のタイトルで points が空の場合、**章扉（section.title）から自動生成**するため、空配列を返さず **ダミー3点**以上を必ず生成  
     * **多様性安全装置**: 本文スライドのうち **content が全体の70%を超える**場合、  
       上記ヒューリスティクスに基づいて **compare/process/timeline/diagram/cards/table/progress** への  
       再割当を試行する（該当シグナルがある限り content への安易なフォールバックを禁止）  

## **3.0 slideDataスキーマ定義（GooglePatternVer.+SpeakerNotes）**

**共通プロパティ**

* **notes?: string**: すべてのスライドオブジェクトに任意で追加可能。スピーカーノートに設定する発表原稿のドラフト（プレーンテキスト）。

**スライドタイプ別定義**

* **タイトル**: { type: 'title', title: '...', date: 'YYYY.MM.DD', notes?: '...' }  
* **章扉**: { type: 'section', title: '...', sectionNo?: number, notes?: '...' } ※sectionNo を指定しない場合は自動連番  
* **クロージング**: { type: 'closing', notes?: '...' }

**本文パターン（必要に応じて選択）**

* **content（1カラム/2カラム＋画像＋小見出し）** { type: 'content', title: '...', subhead?: string, points?: string[], twoColumn?: boolean, columns?: [string[], string[]], images?: (string | { url: string, caption?: string })[], notes?: '...' }  
* **compare（対比）** { type: 'compare', title: '...', subhead?: string, leftTitle: '...', rightTitle: '...', leftItems: string[], rightItems: string[], images?: string[], notes?: '...' }  
* **process（手順・工程）** { type: 'process', title: '...', subhead?: string, steps: string[], images?: string[], notes?: '...' }  
* **timeline（時系列）** { type: 'timeline', title: '...', subhead?: string, milestones: { label: string, date: string, state?: 'done'|'next'|'todo' }[], images?: string[], notes?: '...' }  
* **diagram（レーン図）** { type: 'diagram', title: '...', subhead?: string, lanes: { title: string, items: string[] }[], images?: string[], notes?: '...' }  
* **cards（カードグリッド）** { type: 'cards', title: '...', subhead?: string, columns?: 2|3, items: (string | { title: string, desc?: string })[], images?: string[], notes?: '...' }  
* **table（表）** { type: 'table', title: '...', subhead?: string, headers: string[], rows: string[][], notes?: '...' }  
* **progress（進捗）** { type: 'progress', title: '...', subhead?: string, items: { label: string, percent: number }[], notes?: '...' }

## **4.0 COMPOSITION_RULES（GooglePatternVer.） — 美しさと論理性を最大化する絶対規則**

* **全体構成**:  
  1. title（表紙）  
  2. content（アジェンダ、※章が2つ以上のときのみ）  
  3. section  
  4. 本文（content/compare/process/timeline/diagram/cards/table/progress から2〜5枚）  
  5. （3〜4を章の数だけ繰り返し）  
  6. closing（結び）  
* **テキスト表現・字数**（最大目安）:  
  * title.title: 全角35文字以内  
  * section.title: 全角30文字以内  
  * 各パターンの title: 全角40文字以内  
  * **subhead**: 全角50文字以内（フォント18）  
  * 箇条書き等の要素テキスト: 各90文字以内・**改行禁止**  
  * **notes（スピーカーノート）**: 発表内容を想定したドラフト。文字数制限は緩やかだが、要点を簡潔に。**プレーンテキスト**とし、強調記法は用いないこと。  
  * **禁止記号**: ■ / → を含めない（矢印や区切りは描画ロジック側で処理）  
  * 箇条書き文末の句点「。」**禁止**（体言止め推奨）  
  * **インライン強調記法**: **太字** と [[重要語]]（太字＋Googleブルー）を必要箇所に使用可

## **5.0 SAFETY_GUIDELINES — エラー回避と実行環境負荷の配慮**

* スライド上限: **最大50枚**  
* 画像制約: **50MB未満・25MP以下**の **PNG/JPEG/GIF/WebP**  
* 実行時間: **バックエンド実行環境の上限に配慮**（タイムアウト回避のため、過大な出力を避ける）  
* テキストオーバーフロー回避: 本命令の**上限値厳守**  
* フォント: Arial が無い環境では標準サンセリフに自動フォールバック  
* 文字列リテラルの安全性: ' と \\ を確実にエスケープ

*（任意）各スライドには **classifier** メタを付与してよい：  
  '{ classifier: { signals: string[], rationale: string, confidence: number(0-1) } }' 
  * signals: 判定根拠となった語や構造（例: ["vs","メリデメ","左右並列"] など）  
  * rationale: なぜその type を選んだかの短い理由  
  * confidence: 選定の自信度*

## **6.0 OUTPUT_FORMAT — 最終出力形式**

* 出力は **slideData の _JSON配列_ のみ** とし、**そのまま const slideData = [...] に代入可能**な形で返すこと。  
* **コード断片やテンプレ全文、前置き/解説/謝辞/補足は一切含めない。** 出力は**JSON配列のみ**とする。`;
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
