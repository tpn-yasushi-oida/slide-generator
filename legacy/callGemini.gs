const PROJECT_ID =
  PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
const REGION = PropertiesService.getScriptProperties().getProperty("REGION");
const CLIENT_EMAIL =
  PropertiesService.getScriptProperties().getProperty("CLIENT_EMAIL");
const PRIVATE_KEY =
  PropertiesService.getScriptProperties().getProperty("PRIVATE_KEY");
const PARSED_PRIVATE_KEY = PRIVATE_KEY.replace(/\n/g, "\n");
const GEMINI_MODEL =
  PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL");

function getAccessToken() {
  // JWTトークンの作成
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

  const token = JSON.parse(tokenResponse.getContentText()).access_token;

  return token;
}

function requestGemini(prompt) {
  const token = getAccessToken();
  const geminiEndpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${GEMINI_MODEL}:streamGenerateContent`;
  // const model =

  const requestBody = {
    contents: {
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    },
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

  let generatedText = "";

  // JSONからテキストを抽出して結合
  jsonResponse.forEach(function (item) {
    item.candidates.forEach(function (candidate) {
      candidate.content.parts.forEach(function (part) {
        generatedText += part.text;
      });
    });
  });

  return generatedText;
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

    // 3. 実際にGemini APIにリクエストを送信
    const testPrompt = "こんにちは、簡単なテストです。1+1は何ですか？";
    try {
      const response = requestGemini(testPrompt);
      Logger.log("Gemini APIからの応答: " + response);

      if (!response || response.trim() === "") {
        Logger.log("警告: Gemini APIからの応答が空です");
        return false;
      }

      Logger.log(
        "テスト成功: Gemini APIとの接続とレスポンスの取得に成功しました"
      );
      return true;
    } catch (e) {
      Logger.log(
        "エラー: Gemini APIリクエスト中に例外が発生しました: " + e.toString()
      );
      return false;
    }
  } catch (e) {
    Logger.log("致命的なエラー: " + e.toString());
    return false;
  }
}