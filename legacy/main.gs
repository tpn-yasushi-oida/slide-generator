function mainAuto(prompt, generateOption) {
  const markdowm = createMarkdown_for_autoGeneration(prompt, generateOption);
  const slideURL = createGSlide(markdowm);
  const genarateStyle = "おまかせ生成";

  // 実行ログ出力
  // outputLog(prompt, generateOption, genarateStyle)

  return slideURL;
}

function mainCustom(prompt, generateOption) {
  const markdowm = createMarkdown_for_customGeneration(prompt, generateOption);
  const slideURL = createGSlide(markdowm);
  const genarateStyle = "カスタム生成";

  // 実行ログ出力
  // outputLog(prompt, generateOption, genarateStyle)

  return slideURL;
}

function doGet() {
  var t = HtmlService.createTemplateFromFile("index");
  var html = t.evaluate();
  html.setTitle("SlideGenerator");
  return html;
}

function createMarkdown_for_autoGeneration(prompt, generateOption) {
  const promptFormat = `
# ゴール
指定したマークダウン記法に従って、テーマに沿った内容のプレゼンテーションを作成する。

# 手順
下記の「ルール」を遵守して、ステップ1からステップ5までの順に慎重に作業してください。
実際にGeminiユーザーに対して出力するのは「ステップ4」で生成する「最終生成物」のみを出力するようにしてください。

## ルール
a. 「テーマ」に忠実に従い、プレゼンテーションを作成してください。具体的な数字が示されている場合は、省略せずに全ての要件を満たすように作成してください。
b. 「出力内容の要望」に忠実に従ってください。生成の量やテイストが具体的に示されている場合は、必ずそれを遵守して出力してください。
c. 作成する際は、以下の「ページパターン」1,2,3,4の中から適切なパターンをページごとに選択してください。
c. 適宜、セクションやフォーマットを追加・調整しても構いませんが、必ずこの構成に準拠し、内容に応じたページタイトルの形式を選択してください。
d. 「ステップ4」で生成する「最終生成物」以外の文章や文字列は出力しないでください。

## ステップ1: プレゼンテーションの内容を考える。
あなたはプレゼンテーションの内容を考えるプロです。下記の「テーマ」でプレゼンテーションをする場合のプレゼンテーションの内容を考えてください。テーマで具体的な数字が示されている場合は、省略せずに全ての要件を満たすように作成してください。まずはプレゼンテーションスライドのレイアウトなどは無視して、内容をテキストベースで熟考してください。
### テーマ: ${prompt}

## ステップ2: プレゼンテーションの構成を考える。
ステップ1で考えた内容をプレゼンテーションとして整理してください。「出力内容の要望」を満たすように、テイストを合わせたり、分量を調整してください。各ページでどのような内容を含めるかテキストベースで熟考してください。この際、「出力内容の要望」で具体的なページ数（スライド数）が指定されている場合はそれに従ってください。
### 出力内容の要望: ${generateOption}

## ステップ3: プレゼンテーション内容・構成をマークダウン形式に変換する。
ステップ1, ステップ2で整理したプレゼンテーション内容・構成に沿うように各ページの内容をマークダウン形式に変換する。
テキストで整理した内容を下記の4パターンのいずれかのマークダウンパターンから選択してマークダウン形式に変換してください。

### マークダウンパターン
#### パターン1. **ページタイトル1**: 主に「概要」や「背景説明」に使用します。このセクションでは、全体の概要や導入に適した説明を書いてください。
---
## ページタイトル
[ここに内容の概要や説明を記載。セクション全体の要約や背景情報として利用。]


#### パターン2. **ページタイトル2**: 「メリット」や「機能一覧」のように、個別のポイントを強調したい場合に使用します。ここでは、箇条書きを利用して簡潔に情報を提示します。パターンでは3つのみ示していますが、場合に応じて、減らしたり増やしたりしてください。
---
## ページタイトル
### 1. [箇条書き項目1のタイトル]
- **[箇条書き項目1の内容]**

### 2. [箇条書き項目2のタイトル]
- **[箇条書き項目2の内容]**

### 3. [箇条書き項目3のタイトル]
- **[箇条書き項目3の内容]**


#### パターン3. **ページタイトル3**: 内容がシンプルなリスト形式に適している場合に使用します。このセクションでは、箇条書きだけで項目を羅列してください。パターンでは3つのみ示していますが、場合に応じて、減らしたり増やしたりしてください。
---
## ページタイトル
- **[箇条書き項目1の内容]**
- **[箇条書き項目2の内容]**
- **[箇条書き項目3の内容]**

#### パターン4. **ページタイトル4**: 詳細な説明や具体的なケーススタディを示す場合に使用します。サブタイトルを用いて、より深く掘り下げた内容を提供してください。パターンでは3つのみ示していますが、場合に応じて、減らしたり増やしたりしてください。
---
## ページタイトル
### [サブタイトル1]
- **[内容1]**: [詳細な説明やデータ、分析結果など]

### [サブタイトル2]
- **[内容2]**: [さらに具体的な内容や重要なポイントの説明]

### [サブタイトル3]
- **[内容3]**: [ケーススタディ、統計データ、または応用事例]


## ステップ4: プレゼンテーション全体をまとめて、1つのマークダウンで出力する。
ステップ3で作成した各ページのマークダウンテキストを組み合わせ、プレゼンテーションを1つのマークダウンテキストにまとめて、「最終出力物」を作成してください。
この時、「最終出力物の出力フォーマット」に従って、作成してください。この時、ステップ3で作成したマークダウンを崩さないように慎重に作業してください。
ステップ4で作成した「最終出力物」をGeminiユーザーに生成してください。

### 最終出力物の出力フォーマット（括弧書きは出力フォーマットの注意点を記載）
---
# [タイトル]

## 目次
1. [ページタイトル1]
2. [ページタイトル2]
3. [ページタイトル3]
（フォーマットでは3つのみ記載しているので、適宜増減させる）

（これ以降はステップ3で作成した各ページのマークダウンテキストを使用）`;

  const markdown = requestGemini(promptFormat);

  return markdown;
}

function createMarkdown_for_customGeneration(prompt, generateOption) {
  const promptFormat = `
# ゴール
「原案テキスト」を元にプレゼンテーションを作成し、指定したマークダウン記法に従って整理する。

# 手順
下記の「ルール」を遵守して、ステップ1からステップ5までの順に慎重に作業してください。
実際にGeminiユーザーに対して出力するのは「ステップ4」で生成する「最終生成物」のみを出力するようにしてください。

## ルール
a. 「原案テキスト」に重きをおいてプレゼンテーションを作成してください。表現をわかりやすくしたり、具体例を追加することは問題ありませんが、過度に情報を足したり、改変したりしないようにしてください。
b. 「出力内容の要望」に忠実に従ってください。生成の量やテイストが具体的に示されている場合は、必ずそれを遵守して出力してください。
c. 作成する際は、以下の「ページパターン」1,2,3,4の中から適切なパターンをページごとに選択してください。
c. 適宜、セクションやフォーマットを追加・調整しても構いませんが、必ずこの構成に準拠し、内容に応じたページタイトルの形式を選択してください。
d. 「ステップ4」で生成する「最終生成物」以外の文章や文字列は出力しないでください。

## ステップ1: プレゼンテーションの内容を考える。
あなたはプレゼンテーションの内容を考えるプロです。下記の「原案テキスト」を元にプレゼンテーションの内容を考えてください。基本は「原案テキスト」に従ってください。表現をわかりやすくしたり、具体例を追加することは問題ありませんが、過度に情報を足したり、改変したりしないようにしてください。
まずはプレゼンテーションスライドのレイアウトなどは無視して、内容をテキストベースで熟考してください。
### 原案テキスト: ${prompt}

## ステップ2: プレゼンテーションの構成を考える。
ステップ1で考えた内容のプレゼンテーション構成を考えてください。「出力内容の要望」を満たすように、テイストを合わせたり、分量を調整してください。
各ページでどのような内容を含めるかテキストベースで熟考してください。この際、「出力内容の要望」で具体的なページ数（スライド数）が指定されている場合はそれに従ってください。
分量が多い部分は必ずページを分割してください。複数ページに分割する際は箇条書きや通し番号で羅列されている要素の切れ目で区切るようにしてください。
### 出力内容の要望: ${generateOption}

## ステップ3: プレゼンテーション内容・構成をマークダウン形式に変換する。
ステップ1, ステップ2で整理したプレゼンテーション内容・構成に沿うように各ページの内容をマークダウン形式に変換する。
テキストで整理した内容を下記の4パターンのいずれかのマークダウンパターンから選択してマークダウン形式に変換してください。

### マークダウンパターン
#### パターン1. **ページタイトル1**: 主に「概要」や「背景説明」に使用します。このセクションでは、全体の概要や導入に適した説明を書いてください。
---
## ページタイトル
[ここに内容の概要や説明を記載。セクション全体の要約や背景情報として利用。]


#### パターン2. **ページタイトル2**: 「メリット」や「機能一覧」のように、個別のポイントを強調したい場合に使用します。ここでは、箇条書きを利用して簡潔に情報を提示します。パターンでは3つのみ示していますが、場合に応じて、減らしたり増やしたりしてください。
---
## ページタイトル
### 1. [箇条書き項目1のタイトル]
- **[箇条書き項目1の内容]**

### 2. [箇条書き項目2のタイトル]
- **[箇条書き項目2の内容]**

### 3. [箇条書き項目3のタイトル]
- **[箇条書き項目3の内容]**


#### パターン3. **ページタイトル3**: 内容がシンプルなリスト形式に適している場合に使用します。このセクションでは、箇条書きだけで項目を羅列してください。パターンでは3つのみ示していますが、場合に応じて、減らしたり増やしたりしてください。
---
## ページタイトル
- **[箇条書き項目1の内容]**
- **[箇条書き項目2の内容]**
- **[箇条書き項目3の内容]**


#### パターン4. **ページタイトル4**: 詳細な説明や具体的なケーススタディを示す場合に使用します。サブタイトルを用いて、より深く掘り下げた内容を提供してください。パターンでは3つのみ示していますが、場合に応じて、減らしたり増やしたりしてください。
---
## ページタイトル
### [サブタイトル1]
- **[内容1]**: [詳細な説明やデータ、分析結果など]

### [サブタイトル2]
- **[内容2]**: [さらに具体的な内容や重要なポイントの説明]

### [サブタイトル3]
- **[内容3]**: [ケーススタディ、統計データ、または応用事例]


## ステップ4: プレゼンテーション全体をまとめて、1つのマークダウンで出力する。
ステップ3で作成した各ページのマークダウンテキストを組み合わせ、プレゼンテーションを1つのマークダウンテキストにまとめて、「最終出力物」を作成してください。
この時、「最終出力物の出力フォーマット」に従って、作成してください。この時、ステップ3で作成したマークダウンを崩さないように慎重に作業してください。
ステップ4で作成した「最終出力物」をGeminiユーザーに生成してください。

### 最終出力物の出力フォーマット（括弧書きは出力フォーマットの注意点を記載）
---
# [タイトル]

## 目次
1. [ページタイトル1]
2. [ページタイトル2]
3. [ページタイトル3]
（フォーマットでは3つのみ記載しているので、適宜増減させる）

（これ以降はステップ3で作成した各ページのマークダウンテキストを使用）`;

  const markdown = requestGemini(promptFormat);

  return markdown;
}

function createGSlide(markdown) {
  // スライドタイトルを設定
  const lines = markdown.split("\n");
  const titleLine = lines.find(
    (line) =>
      line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### ")
  );
  const title = titleLine ? titleLine.substring(2) : "Untitled Presentation";

  // スタイル設定とレイアウト設定を変数として定義
  const styles = {
    title: { fontSize: 28, bold: true, top: 170, bottom: 10 }, // # タイトル 表紙
    subtitle1: { fontSize: 20, bold: true, bottom: 50 }, // ## サブタイトル
    subtitle2: { fontSize: 16, bold: true, bottom: 25 }, // ### サブタイトル2
    listItem: { fontSize: 12, bold: false, bottom: 50 }, // - 箇条書き
    bodyText: { fontSize: 14, bold: false, bottom: 25 }, // その他のテキスト
    pageLayout: { top: 40, width: 700, margin: 0, left: 50 }, // ページのレイアウト
  };

  // Google スライドの新規プレゼンテーションを作成
  const presentation = SlidesApp.create(title);
  const slides = presentation.getSlides();

  // デフォルトのレイアウトが強制設定されるため、最初のスライドを削除
  slides[0].remove();

  // 見出しでテキストを分割し、スライドごとに処理
  const slideTexts = markdown
    .trim()
    .split("\n")
    .reduce((acc, line) => {
      if (line.startsWith("# ") || line.startsWith("## ")) {
        acc.push(line.replace(/\*\*/g, ""));
      } else {
        acc[acc.length - 1] += "\n" + line.replace(/\*\*/g, "");
      }
      return acc;
    }, []);

  slideTexts.forEach((slideText, index) => {
    // 新しいスライドを追加
    const slide = presentation.appendSlide();
    // スライドのテキストを解析して要素に分割
    const elements = slideText.split("\n");
    let yOffset = index === 0 ? styles.title.top : styles.pageLayout.top; // 一番最初のみトップの幅
    let textBox;

    let previousElement = ""; // 前の要素を保持する変数を追加

    // Logger.log(elements);

    elements.forEach((element, elementIndex) => {
      if (!element.trim()) {
        return; // 空の要素は無視
      }

      // 要素の種類（見出し、箇条書きなど）を判別
      if (element.startsWith("# ")) {
        const title = element.substr(2);
        textBox = slide
          .insertTextBox(title)
          .setTop(yOffset)
          .setWidth(styles.pageLayout.width)
          .setLeft(styles.pageLayout.left);
        textBox
          .getText()
          .getTextStyle()
          .setFontSize(styles.title.fontSize)
          .setBold(styles.title.bold);
        yOffset += styles.title.bottom;
      } else if (element.startsWith("## ")) {
        const subtitle = element.substr(3);
        textBox = slide
          .insertTextBox(subtitle)
          .setTop(yOffset)
          .setWidth(styles.pageLayout.width)
          .setLeft(styles.pageLayout.left);
        textBox
          .getText()
          .getTextStyle()
          .setFontSize(styles.subtitle1.fontSize)
          .setBold(styles.subtitle1.bold);
        yOffset += styles.subtitle1.bottom;
      } else if (element.startsWith("### ")) {
        const subtitle = element.substr(4);
        textBox = slide
          .insertTextBox(subtitle)
          .setTop(yOffset)
          .setWidth(styles.pageLayout.width)
          .setLeft(styles.pageLayout.left);
        textBox
          .getText()
          .getTextStyle()
          .setFontSize(styles.subtitle2.fontSize)
          .setBold(styles.subtitle2.bold);
        yOffset += styles.subtitle2.bottom;
      } else if (element.startsWith("- ")) {
        const listItem = element.substr(2);

        // 前の要素がリストアイテムであり、かつ現在の要素もリストアイテムである場合
        if (previousElement.startsWith("- ")) {
          // 同じテキストボックスにリストアイテムを追加
          textBox.getText().appendText("\n・ " + listItem);
        } else {
          // 新しいテキストボックスを作成
          textBox = slide
            .insertTextBox("・ " + listItem)
            .setTop(yOffset)
            .setWidth(styles.pageLayout.width)
            .setLeft(styles.pageLayout.left);
          yOffset += styles.listItem.bottom; // 新しいテキストボックス作成後のオフセット更新

          // 最初のリストアイテムのスタイル設定
          textBox
            .getText()
            .getTextStyle()
            .setFontSize(styles.listItem.fontSize)
            .setBold(styles.listItem.bold);
        }

        // テキストスタイルの設定
        const textLength = textBox.getText().asString().length; // 現在のテキストの長さを取得
        const startOffset = textLength - listItem.length - 2; // スタイル適用の開始位置
        const endOffset = textLength; // スタイル適用の終了位置

        // スタイルを適用
        textBox
          .getText()
          .getRange(startOffset, endOffset)
          .getTextStyle()
          .setFontSize(styles.listItem.fontSize)
          .setBold(styles.listItem.bold);
      } else {
        // 通常のテキストを処理
        textBox = slide
          .insertTextBox(element)
          .setTop(yOffset)
          .setWidth(styles.pageLayout.width)
          .setLeft(styles.pageLayout.left);
        textBox
          .getText()
          .getTextStyle()
          .setFontSize(styles.bodyText.fontSize)
          .setBold(styles.bodyText.bold);
        yOffset += styles.bodyText.bottom;
      }

      previousElement = element;
    });
  });
  const slideURL = presentation.getUrl();

  Logger.log("slideURL:", slideURL);

  return slideURL;
}

function outputLog(prompt, generateOption = "", genarateStyle) {
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
