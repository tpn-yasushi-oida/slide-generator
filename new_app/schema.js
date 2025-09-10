/**
 * Gemini 構造化出力用 JSON Schema（response_schema 向け）
 * サンプルデータに完全準拠、oneOfパターンで各スライドタイプを厳密に定義
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
          oneOf: [
            // title専用
            {
              properties: {
                type: { type: "STRING", enum: ["title"] },
                title: { type: "STRING" },
                date: { type: "STRING" },
                notes: { type: "STRING" }
              },
              required: ["type", "title"]
            },
            // bulletCards専用
            {
              properties: {
                type: { type: "STRING", enum: ["bulletCards"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                items: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING" },
                      desc: { type: "STRING" }
                    },
                    required: ["title", "desc"]
                  }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title", "items"]
            },
            // faq専用
            {
              properties: {
                type: { type: "STRING", enum: ["faq"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                items: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      q: { type: "STRING" },
                      a: { type: "STRING" }
                    },
                    required: ["q", "a"]
                  }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title", "items"]
            },
            // closing専用
            {
              properties: {
                type: { type: "STRING", enum: ["closing"] },
                notes: { type: "STRING" }
              },
              required: ["type"]
            },
            // section専用
            {
              properties: {
                type: { type: "STRING", enum: ["section"] },
                title: { type: "STRING" },
                sectionNo: { type: "INTEGER" },
                notes: { type: "STRING" }
              },
              required: ["type", "title"]
            },
            // content専用
            {
              properties: {
                type: { type: "STRING", enum: ["content"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
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
                notes: { type: "STRING" }
              },
              required: ["type", "title"]
            },
            // compare専用
            {
              properties: {
                type: { type: "STRING", enum: ["compare"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
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
                notes: { type: "STRING" }
              },
              required: ["type", "title", "leftTitle", "rightTitle", "leftItems", "rightItems"]
            },
            // process専用
            {
              properties: {
                type: { type: "STRING", enum: ["process"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                steps: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title", "steps"]
            },
            // timeline専用
            {
              properties: {
                type: { type: "STRING", enum: ["timeline"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                milestones: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      label: { type: "STRING" },
                      date: { type: "STRING" },
                      state: {
                        type: "STRING",
                        enum: ["done", "next", "todo"]
                      }
                    },
                    required: ["label", "date"]
                  }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title", "milestones"]
            },
            // diagram専用
            {
              properties: {
                type: { type: "STRING", enum: ["diagram"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                lanes: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING" },
                      items: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                      }
                    },
                    required: ["title", "items"]
                  }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title", "lanes"]
            },
            // cards専用
            {
              properties: {
                type: { type: "STRING", enum: ["cards"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                columns: { type: "INTEGER" },
                items: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING" },
                      desc: { type: "STRING" }
                    }
                  }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title"]
            },
            // headerCards専用
            {
              properties: {
                type: { type: "STRING", enum: ["headerCards"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                columns: { type: "INTEGER" },
                items: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING" },
                      desc: { type: "STRING" }
                    },
                    required: ["title"]
                  }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title", "items"]
            },
            // table専用
            {
              properties: {
                type: { type: "STRING", enum: ["table"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
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
                notes: { type: "STRING" }
              },
              required: ["type", "title", "headers", "rows"]
            },
            // progress専用
            {
              properties: {
                type: { type: "STRING", enum: ["progress"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                items: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      label: { type: "STRING" },
                      percent: { type: "NUMBER" }
                    },
                    required: ["label", "percent"]
                  }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title", "items"]
            },
            // quote専用
            {
              properties: {
                type: { type: "STRING", enum: ["quote"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                text: { type: "STRING" },
                author: { type: "STRING" },
                notes: { type: "STRING" }
              },
              required: ["type", "text", "author"]
            },
            // kpi専用
            {
              properties: {
                type: { type: "STRING", enum: ["kpi"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                columns: { type: "INTEGER" },
                items: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      label: { type: "STRING" },
                      value: { type: "STRING" },
                      change: { type: "STRING" },
                      status: {
                        type: "STRING",
                        enum: ["good", "bad", "neutral"]
                      }
                    },
                    required: ["label", "value"]
                  }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title", "items"]
            },
            // statsCompare専用
            {
              properties: {
                type: { type: "STRING", enum: ["statsCompare"] },
                title: { type: "STRING" },
                subhead: { type: "STRING" },
                leftTitle: { type: "STRING" },
                rightTitle: { type: "STRING" },
                stats: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      label: { type: "STRING" },
                      leftValue: { type: "STRING" },
                      rightValue: { type: "STRING" },
                      trend: {
                        type: "STRING",
                        enum: ["up", "down", "neutral"]
                      }
                    },
                    required: ["label", "leftValue", "rightValue"]
                  }
                },
                notes: { type: "STRING" }
              },
              required: ["type", "title", "leftTitle", "rightTitle", "stats"]
            }
          ]
        }
      }
    }
  };
}