/**
 * Gemini 構造化出力用 JSON Schema（response_schema 向け）
 * サンプルデータと prompt.js 仕様に完全準拠
 */
function getSlideDataSchema() {
  return {
    type: "OBJECT",
    required: ["slideData"],
    properties: {
      slideData: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          required: ["type"],
          properties: {
            // 共通プロパティ
            type: {
              type: "STRING",
              enum: ["title", "section", "closing", "content", "compare", "process", "timeline", "diagram", "cards", "headerCards", "table", "progress", "quote", "kpi", "bulletCards", "faq", "statsCompare"]
            },
            title: { type: "STRING" },
            subhead: { type: "STRING" },
            notes: { type: "STRING" },
            
            // title専用
            date: { type: "STRING" },
            
            // section専用
            sectionNo: { type: "INTEGER" },
            
            // content専用
            points: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            twoColumn: { type: "BOOLEAN" },
            columnData: {
              type: "ARRAY",
              items: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            
            // compare, statsCompare専用
            leftTitle: { type: "STRING" },
            rightTitle: { type: "STRING" },
            leftItems: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            rightItems: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            
            // process専用
            steps: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            
            // timeline専用
            milestones: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                required: ["label", "date"],
                properties: {
                  label: { type: "STRING" },
                  date: { type: "STRING" },
                  state: {
                    type: "STRING",
                    enum: ["done", "next", "todo"]
                  }
                }
              }
            },
            
            // diagram専用
            lanes: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                required: ["title", "items"],
                properties: {
                  title: { type: "STRING" },
                  items: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  }
                }
              }
            },
            
            // table専用
            headers: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            rows: {
              type: "ARRAY",
              items: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            
            // quote専用
            text: { type: "STRING" },
            author: { type: "STRING" },
            
            // 汎用items配列（スライドタイプに応じて内部構造が変わる）
            items: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  // bulletCards用
                  title: { type: "STRING" },
                  desc: { type: "STRING" },
                  
                  // faq用
                  q: { type: "STRING" },
                  a: { type: "STRING" },
                  
                  // cards用
                  label: { type: "STRING" },
                  value: { type: "STRING" },
                  change: { type: "STRING" },
                  status: {
                    type: "STRING",
                    enum: ["good", "bad", "neutral"]
                  },
                  
                  // progress用
                  percent: { type: "NUMBER" }
                }
              }
            },
            
            // statsCompare専用
            stats: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                required: ["label", "leftValue", "rightValue"],
                properties: {
                  label: { type: "STRING" },
                  leftValue: { type: "STRING" },
                  rightValue: { type: "STRING" },
                  trend: {
                    type: "STRING",
                    enum: ["up", "down", "neutral"]
                  }
                }
              }
            },
            
            // 列数指定（cards、headerCards、kpi等用）
            columns: { type: "INTEGER" },
            
            // 画像用（文字列またはオブジェクト形式に対応）
            images: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  url: { type: "STRING" },
                  caption: { type: "STRING" }
                }
              }
            }
          }
        }
      }
    }
  };
}