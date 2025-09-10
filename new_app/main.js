/** ===================== main.gs ===================== */
/**
 * Geminiの構造化出力でスライドデータを生成し、サンプル構造にクリーンアップ
 */
function generateSlideData() {
  const testText = `

Gemini との会話

【社内向け】生成AI活用術プレゼンテーション（叩き台テキスト案）



1. はじめに：なぜ今、我々は生成AIを学ぶべきなのか？



皆さん、ChatGPTや画像生成AIのニュースを耳にしない日はないでしょう。これらは単なる流行り言葉ではありません。産業革命が手作業を機械に置き換えたように、インターネットが情報のやり取りを根底から変えたように、生成AIは私たちの「知的生産」のあり方を劇的に変えようとしています。



この変化は、もはや避けて通ることはできません。重要なのは、生成AIに「仕事を奪われる」と恐れるのではなく、いかにして「強力なアシスタント」として使いこなし、自分自身の能力を拡張するかです。



本日お話しするのは、まさにそのための具体的な方法です。明日から皆さんの業務に直接役立つ活用術から、部署ごとの応用例、そして安全に使うためのルールまで、幅広くご紹介します。このプレゼンが終わる頃には、生成AIが一部の専門家のものではなく、私たち全員の生産性を飛躍的に向上させるための武器であると、きっとご理解いただけるはずです。



2. 生成AIの基礎知識：そもそも「生成AI」とは何か？



まず、基本的な言葉の定義から始めましょう。



生成AI（Generative AI）とは？



一言で言えば、「新しいコンテンツを創り出すAI」です。従来のAIが、与えられたデータからパターンを見つけ「分類」や「予測」をするのが得意だったのに対し、生成AIは学習した膨大なデータをもとに、文章、画像、音声、プログラムコードなどをゼロから生成することができます。



人間が「こういうものを作って」と指示（これをプロンプトと呼びます）を出すと、その意図を汲み取って成果物を出力してくれる、非常に優秀なアシスタントだと考えてください。



代表的な生成AIと得意なこと



テキスト生成AI（大規模言語モデル）： ChatGPT (OpenAI), Gemini (Google)など。文章の作成、要約、翻訳、アイデア出し、質疑応答など、言語に関するあらゆるタスクが得意です。



画像生成AI： Midjourney, Stable Diffusion, DALL-E 3など。テキストで指示するだけで、高品質なイラストや写真を生成できます。プレゼン資料の挿絵や、デザインのラフ案作成に活用できます。



その他： 特定の用途に特化したAIも多数存在します。（例：コード生成を支援するGitHub Copilot、動画を生成するSoraなど）



生成AIの限界と注意点



嘘をつくことがある（ハルシネーション）： 最も注意すべき点です。生成AIは、学習データにない情報や、誤った情報を、さも事実であるかのように生成することがあります。必ずファクトチェック（事実確認）を行い、鵜呑みにしないことが鉄則です。



最新情報に弱い場合がある： モデルによっては、学習データが特定の時点までのものに限られており、ごく最近の出来事については答えられない、あるいは古い情報に基づいて回答することがあります。



専門性と常識の欠如： 業界特有の深い専門知識や、文脈に応じた社会的な常識、暗黙の了解を完全に理解しているわけではありません。最終的な判断は必ず人間が行う必要があります。



3. 【明日から実践！】全社共通・業務効率化のための活用術



ここでは、部署や職種を問わず、誰もがすぐに試せる具体的な活用例を10個ご紹介します。



メール作成の時短



「取引先への会議日程の再調整を依頼する丁寧なメールを書いて」「少し厳しい内容の指摘を、相手を尊重しつつ伝えるメールの案を作成して」のように、目的と状況を伝えるだけで、質の高いメール文面を数秒で作成できます。CCに入れる上司向けの簡潔な状況報告文も一瞬です。



議事録・打ち合わせメモの要約



長文の議事録を貼り付け、「この議事録の要点を3つにまとめて」「決定事項と担当者、期限（ToDo）をリストアップして」と指示するだけで、内容を瞬時に整理できます。会議に参加できなかった人への情報共有もスムーズになります。



伝わる文章へのリライト・校正



自分が書いた報告書や企画書の文章を、「もっと簡潔で分かりやすい表現に書き換えて」「専門用語を減らして、他部署の人が読んでも理解できるようにして」と依頼すれば、客観的な視点で文章をブラッシュアップしてくれます。誤字脱字のチェックも得意です。



面倒な情報収集のサポート



「DX（デジタルトランスフォーメーション）について、全くの初心者に説明するための資料を作りたい。重要なキーワードとそれぞれの意味を教えて」のように、複雑なテーマの概要を掴むのに最適です。Webで検索するよりも、要点がまとまった形で提示されるため効率的です。



アイデアの壁打ち相手



「新しい社内イベントの企画案を10個出して」「若年層向けの新しいプロモーション施策のアイデアを、斬新な切り口で5つ提案して」など、一人では思いつかないような多様なアイデアを出す手伝いをしてくれます。煮詰まった時の最高のブレインストーミング相手です。



プレゼンテーションの構成案作成



「生成AIの社内活用をテーマにした30分のプレゼン資料の構成案を、導入・本編・まとめの形式で作成して」と指示すれば、説得力のあるストーリーラインを提案してくれます。各スライドで話すべき内容まで具体的に示してくれます。



Excel関数の作成



「A列の氏名とB列の部署名を連結して、C列に『（部署名）氏名』の形式で表示するExcel関数を教えて」のように、やりたいことを日本語で伝えるだけで、複雑な関数を正確に教えてくれます。「関数は苦手」という意識を克服できます。



外国語の翻訳・メール作成



海外の取引先からの英語のメールを貼り付け、「このメールの内容を要約し、承諾する旨の丁寧な返信メールを日本語と英語で作成して」といった使い方が可能です。単なる翻訳ツール以上に、文脈やニュアンスを考慮した自然な文章を作成してくれます。



単純作業の自動化（GASコーディング）



少し応用編ですが、「Googleスプレッドシートで、A列が『完了』になったら、その行を別のシートに自動で移動させるGAS（Google Apps Script）のコードを書いて」のように、定型的なPC作業を自動化する簡単なプログラムコードを生成できます。



専門用語の解説



会議や資料で分からない専門用語が出てきた際に、「『アジャイル開発』とは何か、小学生にも分かるように例え話を使って説明して」と聞けば、難解な概念を平易な言葉で理解する手助けをしてくれます。



4. 【応用編】部門別・職種別の活用シナリオ



ここでは、より専門的な業務に生成AIをどう活かすか、具体的なシナリオを見ていきましょう。



営業部門



提案のパーソナライズ： 顧客の業界や過去の取引履歴を伝え、「この顧客の課題に響くような、当社製品Aの提案メールの導入部分を作成して」と指示。顧客ごとに最適化されたアプローチが可能になります。



商談の振り返りと次のアクション整理： 商談の録音データから文字起こししたテキストを貼り付け、「この商談の要点、顧客が懸念していた点、そして我々が次に取るべきアクションをリストアップして」と指示。効率的な案件管理を実現します。



マーケティング部門



コンテンツの大量生成： 「『夏におすすめのスキンケア』というテーマで、Instagram投稿用のキャッチコピーを10個、ブログ記事の見出し案を5個作成して」と指示。多様なパターンのコンテンツを短時間で用意し、効果測定に活かせます。



ペルソナ分析： 「30代、都心在住、環境意識の高い女性というペルソナを設定し、彼女が興味を持ちそうなWebメディアのコンテンツテーマを20個提案して」と指示。ターゲットに響く企画のヒントを得られます。



企画・管理部門



社内規定のドラフト作成： 「リモートワークに関する新しい社内規定を作成したい。目的、対象者、ルール、申請方法などの項目を盛り込んだドラフトを作成して」と指示。ゼロから作成する手間を大幅に削減します。



アンケート分析： 従業員満足度アンケートの自由記述欄の回答をまとめて貼り付け、「これらの回答をポジティブな意見、ネガティブな意見、改善提案に分類し、それぞれ要約して」と指示。社員の生の声を効率的に分析できます。



開発・エンジニア部門



コーディング支援： 「Pythonで、指定したフォルダ内のCSVファイルをすべて読み込み、一つのデータフレームに結合するコードを書いて」といった具体的な処理を依頼。コーディングの初速を上げ、エラーのデバッグ（修正）についても相談できます。



ドキュメント作成： 複雑なプログラムコードを貼り付け、「このコードの処理内容を、非エンジニアにも分かるように日本語で解説して」と指示。仕様書やドキュメント作成の負担を軽減します。



5. 全社で徹底すべき！安全利用のための重要ルール



生成AIは非常に強力なツールですが、使い方を誤ると大きなリスクに繋がります。以下のルールは必ず遵守してください。



【最重要】機密情報・個人情報を絶対に入力しない



お客様の情報、未公開の財務情報、社員の個人情報など、社外秘にあたる情報は絶対に入力しないでください。入力したデータが、AIの学習に利用され、意図せず外部に漏洩する可能性があります。これは、私たちが利用するサービスの多くが、入力されたデータをサービス改善のために利用する規約になっているためです。



**判断に迷う情報は「入力しない」**を徹底してください。



情報の「鵜呑み」は厳禁！必ずファクトチェックを



前述の通り、生成AIは平然と嘘をつきます。生成された情報、特に統計データ、専門的な見解、法律に関する記述などは、必ず信頼できる情報源（公式サイト、公的機関の発表など）で裏付けを取ってください。**AIの回答は「下書き」や「たたき台」**であり、完成品ではないと心得ましょう。



著作権・知的財産権を侵害しない



生成AIが作った文章や画像が、既存の著作物と酷似してしまう可能性があります。特に、社外向けに公開するコンテンツ（Webサイト、広告、出版物など）に利用する場合は、専門家や法務部門に確認するなど、慎重な対応が必要です。社内利用であっても、元ネタが存在しないか、簡単なチェックは心がけましょう。



社内ガイドラインの遵守



今後、会社として正式な利用ガイドラインを策定する可能性があります。その際は、必ず内容を理解し、ルールに沿って利用してください。



6. まとめ：生成AIを「賢い部下」として共に働く未来へ



本日は、生成AIの基礎から具体的な活用術、そして安全利用のルールまでをお話ししました。



重要なメッセージを繰り返します。生成AIは、私たちの仕事を奪うものではなく、私たちの能力を飛躍的に拡張してくれる**「思考の補助輪」であり、「超優秀なアシスタント」**です。



メール作成や情報収集といった日々の小さなタスクから解放されれば、私たちはもっと創造的で、もっと人間的な、付加価値の高い仕事に集中できるようになります。



まずは、今日ご紹介した簡単な活用術から、ぜひ試してみてください。そして、同僚やチーム内で「こんな便利な使い方を見つけたよ」と情報を共有し合ってください。そうした小さな成功体験の積み重ねが、会社全体の生産性を向上させ、新しいイノベーションを生み出す原動力となります。



生成AIと共に働く新しい時代は、もう始まっています。この変化の波を乗りこなし、未来の働き方を自らの手で創り上げていきましょう。



ご清聴ありがとうございました。
`;

  const raw = requestGemini(testText);
  const cleaned = validateAndNormalizeSlideData(raw);
  Logger.log(JSON.stringify(cleaned, null, 2));
  return cleaned;
}


/** 禁止記号・不要改行の除去、前後空白のトリム */
function sanitizeText(s) {
  if (typeof s !== "string") return s;
  // 禁止記号: ■ と → を削除
  let t = s.replace(/[■→]/g, "");
  // 改行は原則禁止の箇条書きに備え全角・半角空白へ
  t = t.replace(/\r?\n/g, " ");
  // 余分なスペース圧縮
  t = t.replace(/\s{2,}/g, " ").trim();
  return t;
}

/** 箇条書き末尾の句点「。」を除去 */
function stripJapanesePeriodEnd(s) {
  if (typeof s !== "string") return s;
  return s.replace(/。$/u, "");
}

/** slideData検証と正規化 */
function validateAndNormalizeSlideData(result) {
  if (!result || typeof result !== "object" || !Array.isArray(result.slideData)) {
    throw new Error("slideData が不正");
  }

  // ルート整形（深いコピー不要ならそのまま参照可）
  const out = { slideData: [] };

  result.slideData.forEach((slide, idx) => {
    if (!slide || typeof slide !== "object") {
      throw new Error(`slide[${idx}] が不正`);
    }
    const type = slide.type;
    if (typeof type !== "string") {
      throw new Error(`slide[${idx}].type が不正`);
    }

    // 共通: notes は任意。文字列化・整形
    if (slide.notes != null) {
      slide.notes = String(slide.notes).trim();
    }

    switch (type) {
      case "title": {
        if (typeof slide.title !== "string") throw new Error("title.title が不正");
        if (typeof slide.date !== "string" || !/^\d{4}\.\d{2}\.\d{2}$/.test(slide.date)) {
          throw new Error("title.date の形式が不正 (YYYY.MM.DD)");
        }
        slide.title = sanitizeText(slide.title);
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "section": {
        if (typeof slide.title !== "string") throw new Error("section.title が不正");
        slide.title = sanitizeText(slide.title);
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        if (slide.sectionNo != null && typeof slide.sectionNo !== "number") {
          throw new Error("section.sectionNo は数値である必要があります");
        }
        break;
      }
      case "closing": {
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "content": {
        if (typeof slide.title !== "string") throw new Error("content.title が不正");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);

        if (slide.points != null) {
          if (!Array.isArray(slide.points)) throw new Error("content.points は配列である必要があります");
          slide.points = slide.points.map((p, j) => {
            if (typeof p !== "string") throw new Error(`content.points[${j}] は文字列である必要があります`);
            return stripJapanesePeriodEnd(sanitizeText(p));
          });
        }

        if (slide.columns != null) {
          if (!Array.isArray(slide.columns) || slide.columns.length !== 2) {
            throw new Error("content.columns は長さ2の配列である必要があります");
          }
          slide.columns = slide.columns.map((col, ci) => {
            if (!Array.isArray(col)) throw new Error(`content.columns[${ci}] は配列である必要があります`);
            return col.map((p, pj) => {
              if (typeof p !== "string") throw new Error(`content.columns[${ci}][${pj}] は文字列である必要があります`);
              return stripJapanesePeriodEnd(sanitizeText(p));
            });
          });
        }

        if (slide.images != null) {
          if (!Array.isArray(slide.images)) throw new Error("content.images は配列である必要があります");
          slide.images = slide.images.map((im) => {
            if (typeof im === "string") return sanitizeText(im);
            if (im && typeof im === "object" && typeof im.url === "string") {
              const o = { url: sanitizeText(im.url) };
              if (im.caption) o.caption = sanitizeText(im.caption);
              return o;
            }
            throw new Error("content.images の要素が不正");
          });
        }

        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        if (slide.twoColumn != null) slide.twoColumn = Boolean(slide.twoColumn);
        break;
      }
      case "compare": {
        ["title", "leftTitle", "rightTitle"].forEach((k) => {
          if (typeof slide[k] !== "string") throw new Error(`compare.${k} が不正`);
          slide[k] = sanitizeText(slide[k]);
        });
        ["leftItems", "rightItems"].forEach((k) => {
          if (!Array.isArray(slide[k])) throw new Error(`compare.${k} は配列である必要があります`);
          slide[k] = slide[k].map((s) => stripJapanesePeriodEnd(sanitizeText(String(s))));
        });
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (slide.images) {
          if (!Array.isArray(slide.images)) throw new Error("compare.images は配列である必要があります");
          slide.images = slide.images.map((s) => sanitizeText(String(s)));
        }
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "process": {
        if (typeof slide.title !== "string") throw new Error("process.title が不正");
        if (!Array.isArray(slide.steps)) throw new Error("process.steps は配列である必要があります");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        slide.steps = slide.steps.map((s) => stripJapanesePeriodEnd(sanitizeText(String(s))));
        if (slide.images) {
          if (!Array.isArray(slide.images)) throw new Error("process.images は配列である必要があります");
          slide.images = slide.images.map((s) => sanitizeText(String(s)));
        }
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "timeline": {
        if (typeof slide.title !== "string") throw new Error("timeline.title が不正");
        if (!Array.isArray(slide.milestones)) throw new Error("timeline.milestones は配列である必要があります");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        slide.milestones = slide.milestones.map((m, mi) => {
          if (!m || typeof m !== "object") throw new Error(`timeline.milestones[${mi}] が不正`);
          if (typeof m.label !== "string" || typeof m.date !== "string") {
            throw new Error(`timeline.milestones[${mi}] の label/date が不正`);
          }
          const outM = {
            label: sanitizeText(m.label),
            date: sanitizeText(m.date)
          };
          if (m.state != null) {
            if (["done", "next", "todo"].indexOf(String(m.state)) === -1) {
              throw new Error(`timeline.milestones[${mi}].state は done|next|todo`);
            }
            outM.state = String(m.state);
          }
          return outM;
        });
        if (slide.images) {
          if (!Array.isArray(slide.images)) throw new Error("timeline.images は配列である必要があります");
          slide.images = slide.images.map((s) => sanitizeText(String(s)));
        }
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "diagram": {
        if (typeof slide.title !== "string") throw new Error("diagram.title が不正");
        if (!Array.isArray(slide.lanes)) throw new Error("diagram.lanes は配列である必要があります");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        slide.lanes = slide.lanes.map((ln, li) => {
          if (!ln || typeof ln !== "object") throw new Error(`diagram.lanes[${li}] が不正`);
          if (typeof ln.title !== "string" || !Array.isArray(ln.items)) {
            throw new Error(`diagram.lanes[${li}] の title/items が不正`);
          }
          return {
            title: sanitizeText(ln.title),
            items: ln.items.map((s) => stripJapanesePeriodEnd(sanitizeText(String(s))))
          };
        });
        if (slide.images) {
          if (!Array.isArray(slide.images)) throw new Error("diagram.images は配列である必要があります");
          slide.images = slide.images.map((s) => sanitizeText(String(s)));
        }
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "cards":
      case "headerCards": {
        if (typeof slide.title !== "string") throw new Error(`${type}.title が不正`);
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (slide.columns != null) {
          if (typeof slide.columns !== "number" || slide.columns < 2 || slide.columns > 3) {
            throw new Error(`${type}.columns は 2〜3`);
          }
        }
        if (!Array.isArray(slide.items)) throw new Error(`${type}.items は配列である必要があります`);
        slide.items = slide.items.map((it) => {
          if (typeof it === "string") return sanitizeText(it);
          if (it && typeof it === "object" && typeof it.title === "string") {
            const o = { title: sanitizeText(it.title) };
            if (it.desc) o.desc = sanitizeText(it.desc);
            return o;
          }
          throw new Error(`${type}.items の要素が不正`);
        });
        if (slide.images) {
          if (!Array.isArray(slide.images)) throw new Error(`${type}.images は配列である必要があります`);
          slide.images = slide.images.map((s) => sanitizeText(String(s)));
        }
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "table": {
        if (typeof slide.title !== "string") throw new Error("table.title が不正");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (!Array.isArray(slide.headers) || !Array.isArray(slide.rows)) {
          throw new Error("table.headers および table.rows は配列である必要があります");
        }
        slide.headers = slide.headers.map((h) => sanitizeText(String(h)));
        slide.rows = slide.rows.map((r, ri) => {
          if (!Array.isArray(r)) throw new Error(`table.rows[${ri}] は配列である必要があります`);
          return r.map((c) => sanitizeText(String(c)));
        });
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "progress": {
        if (typeof slide.title !== "string") throw new Error("progress.title が不正");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (!Array.isArray(slide.items)) throw new Error("progress.items は配列である必要があります");
        slide.items = slide.items.map((it, ii) => {
          if (!it || typeof it !== "object") throw new Error(`progress.items[${ii}] が不正`);
          if (typeof it.label !== "string" || typeof it.percent !== "number") {
            throw new Error(`progress.items[${ii}] の label/percent が不正`);
          }
          return { label: sanitizeText(it.label), percent: it.percent };
        });
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "quote": {
        ["title", "text", "author"].forEach((k) => {
          if (typeof slide[k] !== "string") throw new Error(`quote.${k} が不正`);
          slide[k] = sanitizeText(slide[k]);
        });
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "kpi": {
        if (typeof slide.title !== "string") throw new Error("kpi.title が不正");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (slide.columns != null) {
          if (typeof slide.columns !== "number" || slide.columns < 2 || slide.columns > 4) {
            throw new Error("kpi.columns は 2〜4");
          }
        }
        if (!Array.isArray(slide.items)) throw new Error("kpi.items は配列である必要があります");
        slide.items = slide.items.map((it, ii) => {
          if (!it || typeof it !== "object") throw new Error(`kpi.items[${ii}] が不正`);
          const { label, value, change, status } = it;
          if ([label, value, change].some((x) => typeof x !== "string")) {
            throw new Error(`kpi.items[${ii}] の文字列フィールドが不正`);
          }
          if (["good", "bad", "neutral"].indexOf(String(status)) === -1) {
            throw new Error(`kpi.items[${ii}].status は good|bad|neutral`);
          }
          return {
            label: sanitizeText(label),
            value: sanitizeText(value),
            change: sanitizeText(change),
            status: String(status)
          };
        });
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "bulletCards": {
        if (typeof slide.title !== "string") throw new Error("bulletCards.title が不正");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (!Array.isArray(slide.items)) throw new Error("bulletCards.items は配列である必要があります");
        if (slide.items.length > 3) slide.items = slide.items.slice(0, 3);
        slide.items = slide.items.map((it, ii) => {
          if (!it || typeof it !== "object") throw new Error(`bulletCards.items[${ii}] が不正`);
          if (typeof it.title !== "string" || typeof it.desc !== "string") {
            throw new Error(`bulletCards.items[${ii}] の title/desc が不正`);
          }
          return {
            title: sanitizeText(it.title),
            desc: stripJapanesePeriodEnd(sanitizeText(it.desc))
          };
        });
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "faq": {
        if (typeof slide.title !== "string") throw new Error("faq.title が不正");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (!Array.isArray(slide.items)) throw new Error("faq.items は配列である必要があります");
        slide.items = slide.items.map((it, ii) => {
          if (!it || typeof it !== "object") throw new Error(`faq.items[${ii}] が不正`);
          if (typeof it.q !== "string" || typeof it.a !== "string") {
            throw new Error(`faq.items[${ii}] の q/a が不正`);
          }
          return { q: sanitizeText(it.q), a: sanitizeText(it.a) };
        });
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "statsCompare": {
        if (typeof slide.title !== "string") throw new Error("statsCompare.title が不正");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        ["leftTitle", "rightTitle"].forEach((k) => {
          if (typeof slide[k] !== "string") throw new Error(`statsCompare.${k} が不正`);
          slide[k] = sanitizeText(slide[k]);
        });
        if (!Array.isArray(slide.stats)) throw new Error("statsCompare.stats は配列である必要があります");
        slide.stats = slide.stats.map((st, si) => {
          if (!st || typeof st !== "object") throw new Error(`statsCompare.stats[${si}] が不正`);
          const { label, leftValue, rightValue, trend } = st;
          if ([label, leftValue, rightValue].some((x) => typeof x !== "string")) {
            throw new Error(`statsCompare.stats[${si}] の文字列フィールドが不正`);
          }
          const outS = {
            label: sanitizeText(label),
            leftValue: sanitizeText(leftValue),
            rightValue: sanitizeText(rightValue)
          };
          if (trend != null) {
            if (["up", "down", "neutral"].indexOf(String(trend)) === -1) {
              throw new Error(`statsCompare.stats[${si}].trend は up|down|neutral`);
            }
            outS.trend = String(trend);
          }
          return outS;
        });
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      default:
        throw new Error(`未対応 type: ${type}`);
    }

    out.slideData.push(slide);
  });

  return out;
}
