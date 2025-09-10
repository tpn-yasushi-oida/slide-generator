/** ===================== gemini.gs ===================== */
const PROJECT_ID = PropertiesService.getScriptProperties().getProperty("PROJECT_ID");
const REGION = PropertiesService.getScriptProperties().getProperty("REGION");
const CLIENT_EMAIL = PropertiesService.getScriptProperties().getProperty("CLIENT_EMAIL");
const PRIVATE_KEY = PropertiesService.getScriptProperties().getProperty("PRIVATE_KEY");
const PARSED_PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, "\n");
const GEMINI_MODEL = PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL");

function getAccessToken() {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };
  const signatureInput =
    Utilities.base64EncodeWebSafe(JSON.stringify(header)) + "." +
    Utilities.base64EncodeWebSafe(JSON.stringify(payload));
  const signature = Utilities.computeRsaSha256Signature(signatureInput, PARSED_PRIVATE_KEY);
  const jwt = signatureInput + "." + Utilities.base64EncodeWebSafe(signature);

  const tokenResponse = UrlFetchApp.fetch("https://oauth2.googleapis.com/token", {
    method: "post",
    payload: {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    }
  });

  const token = JSON.parse(tokenResponse.getContentText()).access_token;
  return token;
}

/**
 * 構造化出力で { slideData: [...] } を取得
 * - contents は配列で送信
 * - generationConfig に responseMimeType と responseSchema を設定
 * - レスポンスは candidates[0].content.parts[0].text にJSON文字列で入る想定
 */
function requestGemini(userInput) {
  const token = getAccessToken();
  const geminiEndpoint =
    `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}`
    + `/publishers/google/models/${GEMINI_MODEL}:generateContent`;

  const fullPrompt = getGeminiPrompt() + "\n\n" + userInput;

  const requestBody = {
    contents: [
      { role: "user", parts: [{ text: fullPrompt }] }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: getSlideDataSchema()
    }
  };

  const response = UrlFetchApp.fetch(geminiEndpoint, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + token },
    payload: JSON.stringify(requestBody)
  });

  const jsonResponse = JSON.parse(response.getContentText());

  // 安全に取り出し
  const cand = jsonResponse && jsonResponse.candidates && jsonResponse.candidates[0];
  if (!cand || !cand.content || !cand.content.parts || !cand.content.parts[0]) {
    throw new Error("Gemini 応答に candidates.content.parts がありません");
  }

  const part0 = cand.content.parts[0];
  let parsed;

  if (typeof part0.text === "string") {
    // 期待ケース: JSON文字列
    parsed = JSON.parse(part0.text);
  } else if (typeof part0 === "object" && part0.inlineData) {
    throw new Error("inlineData 形式の構造化出力には未対応です");
  } else if (typeof part0 === "object") {
    // 稀にオブジェクトが直接返ってくる可能性に備える
    parsed = part0;
  } else {
    throw new Error("構造化出力の解析に失敗しました");
  }

  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.slideData)) {
    throw new Error("slideData を含む JSON ではありません");
  }

  return parsed;
}

/**
 * テスト関数 - Gemini APIの接続と構造化出力をテスト
 */
function testGeminiAPI() {
  try {
    const requiredProps = ["PROJECT_ID", "REGION", "CLIENT_EMAIL", "PRIVATE_KEY", "GEMINI_MODEL"];
    const missing = requiredProps.filter((k) => {
      const v = PropertiesService.getScriptProperties().getProperty(k);
      return !v || v.trim() === "";
    });
    if (missing.length) {
      Logger.log("エラー: 未設定のプロパティ: " + missing.join(", "));
      return false;
    }

    const token = getAccessToken();
    if (!token) {
      Logger.log("エラー: アクセストークン取得失敗");
      return false;
    }

    const testInput = "AIについて簡潔なプレゼン。背景・メリット・展望。全体3〜5枚で。";
    const res = requestGemini(testInput);

    if (!res || !Array.isArray(res.slideData) || !res.slideData.length) {
      Logger.log("警告: slideData が不正または空");
      return false;
    }

    Logger.log("OK: slideData length = " + res.slideData.length);
    Logger.log(JSON.stringify(res, null, 2));
    return true;
  } catch (e) {
    Logger.log("致命的エラー: " + e.message);
    return false;
  }
}
