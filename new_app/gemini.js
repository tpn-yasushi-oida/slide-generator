const PROJECT_ID = PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
const REGION = PropertiesService.getScriptProperties().getProperty("REGION");
const CLIENT_EMAIL = PropertiesService.getScriptProperties().getProperty("CLIENT_EMAIL");
const PRIVATE_KEY = PropertiesService.getScriptProperties().getProperty("PRIVATE_KEY");
const PERSED_PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
const GEMINI_MODEL = PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL");


function getAccessToken() {

  // JWTトークンの作成
  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };

  const signatureInput = Utilities.base64EncodeWebSafe(JSON.stringify(header)) + "." +
                        Utilities.base64EncodeWebSafe(JSON.stringify(payload));
  const signature = Utilities.computeRsaSha256Signature(signatureInput, PERSED_PRIVATE_KEY);

  const jwt = signatureInput + "." + Utilities.base64EncodeWebSafe(signature);

  // OAuth 2.0トークンの取得
  const tokenResponse = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    payload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }
  });

  const token = JSON.parse(tokenResponse.getContentText()).access_token;

return token;
}

function requestGemini(userInput) {
  const token = getAccessToken();
  const geminiEndpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${GEMINI_MODEL}:generateContent`;

  // プロンプトとユーザー入力を結合
  const fullPrompt = getGeminiPrompt() + "\n\n" + userInput;

  const requestBody = {
    contents: {
      role: "user",
      parts: [
        {
          text: fullPrompt,
        },
      ],
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: getSlideDataSchema()
    }
  };

  const response = UrlFetchApp.fetch(geminiEndpoint, {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
    },
    payload: JSON.stringify(requestBody),
  });

  // responseは文字列形式なので、JSONとしてパースする
  const jsonResponse = JSON.parse(response.getContentText());

  // 構造化出力では、candidates[0].content.parts[0].textにJSONが格納されている
  const generatedText = jsonResponse.candidates[0].content.parts[0].text;

  // JSONをパースして返す
  return JSON.parse(generatedText);
}

/**
 * テスト関数 - Gemini APIの接続をテストします
 */
function testGeminiAPI() {
  try {
    // 1. 環境変数が正しく設定されているか確認
    const requiredProps = [
      "PROJECT_ID",
      "REGION",
      "CLIENT_EMAIL",
      "PRIVATE_KEY",
      "GEMINI_MODEL",
    ];
    const missingProps = requiredProps.filter((prop) => {
      const value = PropertiesService.getScriptProperties().getProperty(prop);
      return !value || value.trim() === "";
    });

    if (missingProps.length > 0) {
      Logger.log(
        "エラー: 次の必須プロパティが設定されていません: " +
          missingProps.join(", ")
      );
      return false;
    }

    // 2. アクセストークンの取得をテスト
    try {
      const token = getAccessToken();
      if (!token || token.trim() === "") {
        Logger.log("エラー: アクセストークンの取得に失敗しました");
        return false;
      }
      Logger.log("アクセストークンの取得に成功しました");
    } catch (e) {
      Logger.log(
        "エラー: アクセストークン取得中に例外が発生しました: " + e.toString()
      );
      return false;
    }

    // 3. 実際にGemini APIに構造化出力をリクエスト送信
    const testInput = "AIについて簡潔なプレゼンテーションを作成してください。背景、メリット、今後の展望を含めて3枚のスライドでお願いします。";
    try {
      const response = requestGemini(testInput);
      Logger.log("Gemini APIからの構造化応答: " + JSON.stringify(response, null, 2));

      // 構造化出力の検証
      if (!response || !response.slideData || !Array.isArray(response.slideData)) {
        Logger.log("警告: 構造化出力の形式が正しくありません");
        return false;
      }

      // slideDataの内容を検証
      if (response.slideData.length === 0) {
        Logger.log("警告: slideDataが空です");
        return false;
      }

      // 最初のスライドのタイプを確認
      const firstSlide = response.slideData[0];
      if (!firstSlide.type) {
        Logger.log("警告: スライドにtypeプロパティがありません");
        return false;
      }

      Logger.log("構造化出力テスト成功: " + response.slideData.length + "枚のスライドが生成されました");
      Logger.log("最初のスライドタイプ: " + firstSlide.type);
      return true;
    } catch (e) {
      Logger.log(
        "エラー: 構造化出力リクエスト中に例外が発生しました: " + e.toString()
      );
      return false;
    }
  } catch (e) {
    Logger.log("致命的なエラー: " + e.toString());
    return false;
  }
}