function getEnhansePrompt(userInput) {
  return `
<目的>
<raw>…</raw>内の非構造テキストを、より効果的なプレゼンテーション構造へ変換する。  
</目的>

<出力形式>
出力はマークダウン形式で出力。変換後のテキスト以外を含めないこと。（前置きや補足説明は含めるべきではない）
</出力形式>


<指示詳細>
1. <raw>…</raw>内の非構造テキストはユーザーの作成したいプレゼンテーションの素案です。
2. 素案をもとにより効果的なプレゼンテーションスライドを作成します。
3. プレゼンテーションスライドを作成するうえで、素案の大筋を変更せずに構成（順番、情報の見せ方、伝え方、追加情報）をブラッシュアップしてください。
4. プレゼンテーションスライドを作成するときに使用できるようスライドパターンは、<使用可能スライドパターン>…</使用可能スライドパターン>に記しているものが全てです。
5. どのスライドを使用して、どのような見せ方をするのか決めてください。使用したいスライドパターンがどれかわかるように最終出力のマークダウンにメモを追加しておいてください。
6. 選択したスライドパターンを使うのに最適なスライド内容か慎重に確認してください。例えば、並列させる要素が2つならcompareやprocessを使用するべき。並列させる要素が3つならbulletCards、4つなら、cardsやheaderCardsを使用するべき。以上のように使用するパターンと内容で乖離がないか確認してください。
7. 確認して、問題があれば、より適切なスライドパターン選択になるように、パターン選択やプレゼン内容を調整してください。
8. 以上を踏まえて、スライドごとのアウトラインをまとめる前に、各スライドの目的とキーとなる伝達要素を必ず明確化すること。
9. bulletCards を利用する場合は、各カードを「タイトル: 説明」の形式で記述し、説明文を省略しないこと。説明がない場合でも短い補足を必ず追加すること。
</指示詳細>


<使用可能スライドパターン>
スライドタイプ
---
- title
  { "type": "title", "title": "...", "notes"?: "..." } // date はサーバー側で自動設定 (YYYY.MM.DD)
- section
  { "type": "section", "title": "...", "sectionNo"?: number, "notes"?: "..." }
- closing
  { "type": "closing", "notes"?: "..." }
---

本文パターン
---
- content
  { "type": "content", "title": "...", "subhead"?: "string", "points"?: "string[]", "twoColumn"?: "boolean", "columns"?: ["string[]", "string[]"], "images"?: ( "string" | { "url": "string", "caption"?: "string" } )[], "notes"?: "..." }
- compare
  { "type": "compare", "title": "...", "subhead"?: "string", "leftTitle": "...", "rightTitle": "...", "leftItems": "string[]", "rightItems": "string[]", "images"?: "string[]", "notes"?: "..." }
- process
  { "type": "process", "title": "...", "subhead"?: "string", "steps": "string[]", "images"?: "string[]", "notes"?: "..." }
- timeline
  { "type": "timeline", "title": "...", "subhead"?: "string", "milestones": [{ "label": "string", "date": "string", "state"?: "done"|"next"|"todo" }], "images"?: "string[]", "notes"?: "..." }
- diagram
  { "type": "diagram", "title": "...", "subhead"?: "string", "lanes": [{ "title": "string", "items": "string[]" }], "images"?: "string[]", "notes"?: "..." }
- cards
  { "type": "cards", "title": "...", "subhead"?: "string", "columns"?: 2|3, "items": ( "string" | { "title": "string", "desc"?: "string" } )[], "images"?: "string[]", "notes"?: "..." }
- headerCards
  { "type": "headerCards", "title": "...", "subhead"?: "string", "columns"?: 2|3, "items": [{ "title": "string", "desc"?: "string" }], "images"?: "string[]", "notes"?: "..." }
- table
  { "type": "table", "title": "...", "subhead"?: "string", "headers": "string[]", "rows": "string[][]", "notes"?: "..." }
- progress
  { "type": "progress", "title": "...", "subhead"?: "string", "items": [{ "label": "string", "percent": "number" }], "notes"?: "..." }
- quote
  { "type": "quote", "title": "...", "subhead"?: "string", "text": "string", "author": "string", "notes"?: "..." }
- kpi
  { "type": "kpi", "title": "...", "subhead"?: "string", "columns"?: 2|3|4, "items": [{ "label": "string", "value": "string", "change": "string", "status": "good"|"bad"|"neutral" }], "notes"?: "..." }
- bulletCards
  { "type": "bulletCards", "title": "...", "subhead"?: "string", "items": [{ "title": "string", "desc": "string" }], "notes"?: "..." }
- faq
  { "type": "faq", "title": "...", "subhead"?: "string", "items": [{ "q": "string", "a": "string" }], "notes"?: "..." }
- statsCompare
  { "type": "statsCompare", "title": "...", "subhead"?: "string", "leftTitle": "...", "rightTitle": "...", "stats": [{ "label": "string", "leftValue": "string", "rightValue": "string", "trend"?: "up"|"down"|"neutral" }], "notes"?: "..." }
---
</使用可能スライドパターン>

<raw>
${userInput}
</raw>
`;
}

function enhanceUserInput(userInput) {
  try {
    const enhancerPrompt = getEnhansePrompt(userInput);
    const enhanced = requestGemini(enhancerPrompt);
    if (typeof enhanced === "string" && enhanced.trim()) {
      return enhanced.trim();
    }
    console.log("[ENHANCE] 応答が空のため元の入力を利用します。");
    return userInput;
  } catch (error) {
    console.error("[ENHANCE] エンハンス処理でエラーが発生したため元の入力を使用します:", error);
    return userInput;
  }
}

