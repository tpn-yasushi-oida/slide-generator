function doGet() {
  const t = HtmlService.createTemplateFromFile("index");
  const html = t.evaluate();
  html.setTitle("SlideGenerator3");
  return html;
}

function outputLog(prompt, generateOption="", genarateStyle) {
  const spreadsheetId = "1Ji3P-zkcN5tUsOnx_yT6SgK_Kac4nMhlUMLC3xJr40c";
  const sheetName = "実行履歴";

  const email = Session.getActiveUser().getEmail();
  const now = new Date();

  // スプレッドシートを取得
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);

  // 新しい行に結果を出力
  const lastRow = sheet.getLastRow() + 1;

  // 同じ行の次のセルにプロンプトを貼り付ける
  sheet.getRange(lastRow, 2).setValue(now);
  sheet.getRange(lastRow, 3).setValue(email);
  sheet.getRange(lastRow, 4).setValue(prompt);
  sheet.getRange(lastRow, 5).setValue(generateOption);
  sheet.getRange(lastRow, 6).setValue(genarateStyle);
}