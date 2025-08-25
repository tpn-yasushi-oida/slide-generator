# Webアプリ実装フロー（original_gem_prompt.md 準拠 + patternPlan）

以下の流れで Web アプリが `original_gem_prompt.md` の設計思想を再現します。

## 1. 入力受付（index.html）
- `prompt` と任意の `generateOption` を受け取る。
- ローディング/キャンセルUIを提供。

## 2. プロンプト拡張（main.gs）
- `buildUserPromptWithGuidance()` で以下を付与:
  - パターン選定ガイダンス（サポート済み表現パターンとヒューリスティック）
  - 入力テキストからの期待パターン抽出（analyzePatternNeeds）

## 3. 構造化出力で生成（callGemini.gs）
- `getSlideDataSchema()` のトップレベルは次を許容:
  - 推奨: `{ patternPlan: { global, sections[] }, slideData: Slide[] }`
  - 互換: `Slide[]`（従来の配列のみ）
- `getGeminiPrompt()` で出力形式を明示（推奨/互換）。
- Vertex AI または Direct API で `responseSchema` を指定し JSON 生成。

## 4. 再生成の安全装置（main.gs）
- 期待パターンが検出され、かつ content のみの場合は 1 回だけ再生成指示を付与して呼び直し。

## 5. スライド生成（majin_slide_generator.gs）
- `generateSlideFromJson(payload)` は以下を受理:
  - `Slide[]` もしくは `{ slideData: Slide[], patternPlan?: {...} }`
- 受領した `patternPlan` は `applyPatternPlanAdjustments()` フックで今後の調整に活用できる（現状は非破壊・ログのみ）。
- `slideGenerators` により type ごとに描画実行、`notes` をスピーカーノートに反映。

## 6. 返却
- 生成された Google スライドの URL を返却し、UI のボタンに紐づけて開けるようにする。

---

## JSON スキーマ（要点）

トップレベル（oneOf）:
- 推奨: `{"patternPlan": {"global": string[], "sections": [{"sectionTitle"?: string, "sectionIndex"?: number, "preferredPatterns": ("content"|"compare"|"process"|"timeline"|"diagram"|"cards"|"table"|"progress")[]}]}, "slideData": Slide[]}`
- 互換: `Slide[]`

Slide は `type` に応じて original_gem_prompt.md の各スキーマに準拠。

