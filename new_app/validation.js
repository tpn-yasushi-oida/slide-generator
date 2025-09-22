/** ===================== validation.js ===================== */

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


/** 正規化用の共通ヘルパー */
function sanitizeCell(value) {
  return sanitizeText(String(value ?? ""));
}

function canonicalKey(value) {
  return sanitizeCell(value).toLowerCase().replace(/\s|_/g, "");
}

function pickTableValue(row, header, index) {
  if (!row || typeof row !== "object") return "";
  if (Object.prototype.hasOwnProperty.call(row, header)) return row[header];
  const target = canonicalKey(header);
  for (const key of Object.keys(row)) {
    if (canonicalKey(key) === target) {
      return row[key];
    }
  }
  if (Object.prototype.hasOwnProperty.call(row, index)) return row[index];
  if (Object.prototype.hasOwnProperty.call(row, String(index))) return row[String(index)];
  return "";
}

function splitTableRowString(rowString, expectedLength) {
  const raw = String(rowString || "")
    .split(/[|｜,、	;／／]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const parts = new Array(expectedLength).fill("");

  for (let i = 0; i < expectedLength; i++) {
    parts[i] = raw[i] ? sanitizeText(raw[i]) : "";
  }
  return parts;
}

function formatDateAsJstToday() {
  const now = new Date();
  if (typeof Utilities !== "undefined" && Utilities.formatDate) {
    return Utilities.formatDate(now, "Asia/Tokyo", "yyyy.MM.dd");
  }
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const jst = new Date(utc + 9 * 60 * 60000);
  const year = jst.getUTCFullYear();
  const month = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(jst.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
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
        slide.title = sanitizeText(slide.title);
        slide.date = formatDateAsJstToday();
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
        slide.headers = slide.headers.map((h) => sanitizeCell(h));
        const headerCount = slide.headers.length;
        slide.rows = slide.rows.map((r, ri) => {
          if (Array.isArray(r)) {
            const result = new Array(headerCount).fill("");
            for (let i = 0; i < headerCount; i++) {
              result[i] = sanitizeCell(r[i]);
            }
            return result;
          }
          if (r && typeof r === "object") {
            return slide.headers.map((header, hi) => sanitizeCell(pickTableValue(r, header, hi)));
          }
          if (typeof r === "string") {
            const parts = splitTableRowString(r, headerCount);
            const result = new Array(headerCount).fill("");
            for (let i = 0; i < headerCount; i++) {
              result[i] = sanitizeCell(parts[i]);
            }
            return result;
          }
          throw new Error(`table.rows[${ri}] が不正`);
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
        if (!Array.isArray(slide.items)) throw new Error("faq.items は配列である必要があります");
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        slide.items = slide.items.map((it, ii) => {
          if (typeof it === "string") {
            const text = sanitizeCell(it);
            if (!text) throw new Error(`faq.items[${ii}] が不正`);
            return { q: text, a: "" };
          }
          if (!it || typeof it !== "object") throw new Error(`faq.items[${ii}] が不正`);
          const qSource = it.q ?? it.question;
          const aSource = it.a ?? it.answer ?? it.response ?? it.detail ?? "";
          if (typeof qSource !== "string") {
            throw new Error(`faq.items[${ii}] の質問文が不正`);
          }
          const item = { q: sanitizeCell(qSource), a: sanitizeCell(aSource) };
          if (!item.a) item.a = "";
          if (it.source != null) item.source = sanitizeCell(it.source);
          return item;
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

// function validationUserOptions(){
  
// }