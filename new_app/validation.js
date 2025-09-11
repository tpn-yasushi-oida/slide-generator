/**
 * スライド生成データのサニタイズと厳格な正規化
 * - sanitizeText / stripJapanesePeriodEnd
 * - validateAndNormalizeSlideData: 入力(Array または { slideData: Array }) → 出力(Array)
 */

function sanitizeText(s) {
  if (typeof s !== "string") return s;
  let t = s.replace(/[、。]/g, ""); // 禁則: 句読点の末尾処理に備えて軽く除去
  t = t.replace(/\r?\n/g, " ");
  t = t.replace(/\s{2,}/g, " ").trim();
  return t;
}

function stripJapanesePeriodEnd(s) {
  if (typeof s !== "string") return s;
  return s.replace(/。$/u, "");
}

function validateAndNormalizeSlideData(result) {
  const src = Array.isArray(result)
    ? result
    : (result && typeof result === "object" && Array.isArray(result.slideData))
      ? result.slideData
      : null;
  if (!src) throw new Error("slideData が不正です");

  const out = [];

  src.forEach((slide, idx) => {
    if (!slide || typeof slide !== "object") {
      throw new Error(`slide[${idx}] が不正です`);
    }
    const type = slide.type;
    if (typeof type !== "string") {
      throw new Error(`slide[${idx}].type が不正です`);
    }

    if (slide.notes != null) slide.notes = String(slide.notes).trim();

    switch (type) {
      case "title": {
        if (typeof slide.title !== "string") throw new Error("title.title が不正です");
        if (typeof slide.date !== "string" || !/^\d{4}\.\d{2}\.\d{2}$/.test(slide.date)) {
          throw new Error("title.date の書式が不正です (YYYY.MM.DD)");
        }
        slide.title = sanitizeText(slide.title);
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "section": {
        if (typeof slide.title !== "string") throw new Error("section.title が不正です");
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
        if (typeof slide.title !== "string") throw new Error("content.title が不正です");
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
            throw new Error("content.images の要素が不正です");
          });
        }

        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        if (slide.twoColumn != null) slide.twoColumn = Boolean(slide.twoColumn);
        break;
      }
      case "compare": {
        ["title", "leftTitle", "rightTitle"].forEach((k) => {
          if (typeof slide[k] !== "string") throw new Error(`compare.${k} が不正です`);
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
        if (typeof slide.title !== "string") throw new Error("process.title が不正です");
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
        if (typeof slide.title !== "string") throw new Error("timeline.title が不正です");
        if (!Array.isArray(slide.milestones)) throw new Error("timeline.milestones は配列である必要があります");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        slide.milestones = slide.milestones.map((m, mi) => {
          if (!m || typeof m !== "object") throw new Error(`timeline.milestones[${mi}] が不正です`);
          const o = {
            label: sanitizeText(String(m.label || "")),
            date: sanitizeText(String(m.date || ""))
          };
          if (m.state != null) {
            const st = String(m.state);
            if (["done", "next", "todo"].indexOf(st) === -1) throw new Error("timeline.milestones[].state は done|next|todo");
            o.state = st;
          }
          return o;
        });
        if (slide.images) {
          if (!Array.isArray(slide.images)) throw new Error("timeline.images は配列である必要があります");
          slide.images = slide.images.map((s) => sanitizeText(String(s)));
        }
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "diagram": {
        if (typeof slide.title !== "string") throw new Error("diagram.title が不正です");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (!Array.isArray(slide.lanes)) throw new Error("diagram.lanes は配列である必要があります");
        slide.lanes = slide.lanes.map((ln, li) => {
          if (!ln || typeof ln !== "object" || typeof ln.title !== "string" || !Array.isArray(ln.items)) {
            throw new Error(`diagram.lanes[${li}] が不正です`);
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
        if (typeof slide.title !== "string") throw new Error(`${type}.title が不正です`);
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
          throw new Error(`${type}.items の要素が不正です`);
        });
        if (slide.images) {
          if (!Array.isArray(slide.images)) throw new Error(`${type}.images は配列である必要があります`);
          slide.images = slide.images.map((s) => sanitizeText(String(s)));
        }
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "table": {
        if (typeof slide.title !== "string") throw new Error("table.title が不正です");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (!Array.isArray(slide.headers) || !Array.isArray(slide.rows)) {
          throw new Error("table.headers と table.rows は配列である必要があります");
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
        if (typeof slide.title !== "string") throw new Error("progress.title が不正です");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (!Array.isArray(slide.items)) throw new Error("progress.items は配列である必要があります");
        slide.items = slide.items.map((it, ii) => {
          if (!it || typeof it !== "object") throw new Error(`progress.items[${ii}] が不正です`);
          if (typeof it.label !== "string" || typeof it.percent !== "number") {
            throw new Error(`progress.items[${ii}] の label/percent が不正です`);
          }
          return { label: sanitizeText(it.label), percent: it.percent };
        });
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "quote": {
        ["title", "text", "author"].forEach((k) => {
          if (typeof slide[k] !== "string") throw new Error(`quote.${k} が不正です`);
          slide[k] = sanitizeText(slide[k]);
        });
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "kpi": {
        if (typeof slide.title !== "string") throw new Error("kpi.title が不正です");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (slide.columns != null) {
          if (typeof slide.columns !== "number" || slide.columns < 2 || slide.columns > 4) {
            throw new Error("kpi.columns は 2〜4");
          }
        }
        if (!Array.isArray(slide.items)) throw new Error("kpi.items は配列である必要があります");
        slide.items = slide.items.map((it, ii) => {
          if (!it || typeof it !== "object") throw new Error(`kpi.items[${ii}] が不正です`);
          const { label, value, change, status } = it;
          if ([label, value, change].some((x) => typeof x !== "string")) {
            throw new Error(`kpi.items[${ii}] の必須フィールドが不正です`);
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
        if (typeof slide.title !== "string") throw new Error("bulletCards.title が不正です");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (!Array.isArray(slide.items)) throw new Error("bulletCards.items は配列である必要があります");
        if (slide.items.length > 3) slide.items = slide.items.slice(0, 3);
        slide.items = slide.items.map((it, ii) => {
          if (!it || typeof it !== "object") throw new Error(`bulletCards.items[${ii}] が不正です`);
          if (typeof it.title !== "string" || typeof it.desc !== "string") {
            throw new Error(`bulletCards.items[${ii}] の title/desc が不正です`);
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
        if (typeof slide.title !== "string") throw new Error("faq.title が不正です");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        if (!Array.isArray(slide.items)) throw new Error("faq.items は配列である必要があります");
        slide.items = slide.items.map((it, ii) => {
          if (!it || typeof it !== "object") throw new Error(`faq.items[${ii}] が不正です`);
          if (typeof it.q !== "string" || typeof it.a !== "string") {
            throw new Error(`faq.items[${ii}] の q/a が不正です`);
          }
          return { q: sanitizeText(it.q), a: sanitizeText(it.a) };
        });
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      case "statsCompare": {
        if (typeof slide.title !== "string") throw new Error("statsCompare.title が不正です");
        slide.title = sanitizeText(slide.title);
        if (slide.subhead) slide.subhead = sanitizeText(slide.subhead);
        ["leftTitle", "rightTitle"].forEach((k) => {
          if (typeof slide[k] !== "string") throw new Error(`statsCompare.${k} が不正です`);
          slide[k] = sanitizeText(slide[k]);
        });
        if (!Array.isArray(slide.stats)) throw new Error("statsCompare.stats は配列である必要があります");
        slide.stats = slide.stats.map((st, si) => {
          if (!st || typeof st !== "object") throw new Error(`statsCompare.stats[${si}] が不正です`);
          const { label, leftValue, rightValue, trend } = st;
          if ([label, leftValue, rightValue].some((x) => typeof x !== "string")) {
            throw new Error(`statsCompare.stats[${si}] の必須フィールドが不正です`);
          }
          const o = {
            label: sanitizeText(label),
            leftValue: sanitizeText(leftValue),
            rightValue: sanitizeText(rightValue)
          };
          if (trend != null) {
            if (["up", "down", "neutral"].indexOf(String(trend)) === -1) {
              throw new Error(`statsCompare.stats[${si}].trend は up|down|neutral`);
            }
            o.trend = String(trend);
          }
          return o;
        });
        if (slide.notes) slide.notes = sanitizeText(slide.notes);
        break;
      }
      default:
        throw new Error(`未対応 type: ${type}`);
    }

    out.push(slide);
  });

  return out;
}

