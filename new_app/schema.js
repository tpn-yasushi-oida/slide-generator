/**
 * Gemini 構造化出力用スキーマ（Vertex対応・小文字型・enum/範囲で統一）
 * 出力トップ: { "slideData": [...] }
 */
function getSlideDataSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["slideData"],
    properties: {
      slideData: {
        type: "array",
        items: {
          oneOf: [
            // title
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title"],
              properties: {
                type: { type: "string", enum: ["title"] },
                title: { type: "string" },
                date: { type: "string", pattern: "^\d{4}\.\d{2}\.\d{2}$" },
                notes: { type: "string" }
              }
            },
            // section
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title"],
              properties: {
                type: { type: "string", enum: ["section"] },
                title: { type: "string" },
                sectionNo: { type: "integer" },
                notes: { type: "string" }
              }
            },
            // closing
            {
              type: "object",
              additionalProperties: false,
              required: ["type"],
              properties: {
                type: { type: "string", enum: ["closing"] },
                notes: { type: "string" }
              }
            },
            // content
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title"],
              properties: {
                type: { type: "string", enum: ["content"] },
                title: { type: "string" },
                subhead: { type: "string" },
                points: { type: "array", items: { type: "string" } },
                twoColumn: { type: "boolean" },
                columns: {
                  type: "array",
                  minItems: 2,
                  maxItems: 2,
                  items: { type: "array", items: { type: "string" } }
                },
                images: {
                  type: "array",
                  items: {
                    oneOf: [
                      { type: "string" },
                      {
                        type: "object",
                        additionalProperties: false,
                        required: ["url"],
                        properties: {
                          url: { type: "string" },
                          caption: { type: "string" }
                        }
                      }
                    ]
                  }
                },
                notes: { type: "string" }
              }
            },
            // compare
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "leftTitle", "rightTitle", "leftItems", "rightItems"],
              properties: {
                type: { type: "string", enum: ["compare"] },
                title: { type: "string" },
                subhead: { type: "string" },
                leftTitle: { type: "string" },
                rightTitle: { type: "string" },
                leftItems: { type: "array", items: { type: "string" } },
                rightItems: { type: "array", items: { type: "string" } },
                images: { type: "array", items: { type: "string" } },
                notes: { type: "string" }
              }
            },
            // process
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "steps"],
              properties: {
                type: { type: "string", enum: ["process"] },
                title: { type: "string" },
                subhead: { type: "string" },
                steps: { type: "array", items: { type: "string" } },
                images: { type: "array", items: { type: "string" } },
                notes: { type: "string" }
              }
            },
            // timeline
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "milestones"],
              properties: {
                type: { type: "string", enum: ["timeline"] },
                title: { type: "string" },
                subhead: { type: "string" },
                milestones: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["label", "date"],
                    properties: {
                      label: { type: "string" },
                      date: { type: "string" },
                      state: { type: "string", enum: ["done", "next","todo"] }
                    }
                  }
                },
                images: { type: "array", items: { type: "string" } },
                notes: { type: "string" }
              }
            },
            // diagram
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "lanes"],
              properties: {
                type: { type: "string", enum: ["diagram"] },
                title: { type: "string" },
                subhead: { type: "string" },
                lanes: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["title", "items"],
                    properties: {
                      title: { type: "string" },
                      items: { type: "array", items: { type: "string" } }
                    }
                  }
                },
                images: { type: "array", items: { type: "string" } },
                notes: { type: "string" }
              }
            },
            // cards
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "items"],
              properties: {
                type: { type: "string", enum: ["cards"] },
                title: { type: "string" },
                subhead: { type: "string" },
                columns: { type: "integer", minimum: 2, maximum: 3 },
                items: {
                  type: "array",
                  items: {
                    oneOf: [
                      { type: "string" },
                      {
                        type: "object",
                        additionalProperties: false,
                        required: ["title"],
                        properties: {
                          title: { type: "string" },
                          desc: { type: "string" }
                        }
                      }
                    ]
                  }
                },
                images: { type: "array", items: { type: "string" } },
                notes: { type: "string" }
              }
            },
            // headerCards
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "items"],
              properties: {
                type: { type: "string", enum: ["headerCards"] },
                title: { type: "string" },
                subhead: { type: "string" },
                columns: { type: "integer", minimum: 2, maximum: 3 },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["title"],
                    properties: {
                      title: { type: "string" },
                      desc: { type: "string" }
                    }
                  }
                },
                images: { type: "array", items: { type: "string" } },
                notes: { type: "string" }
              }
            },
            // table
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "headers", "rows"],
              properties: {
                type: { type: "string", enum: ["table"] },
                title: { type: "string" },
                subhead: { type: "string" },
                headers: { type: "array", items: { type: "string" } },
                rows: {
                  type: "array",
                  items: {
                    oneOf: [
                      {
                        type: "array",
                        items: { type: "string" }
                      },
                      {
                        type: "object",
                        additionalProperties: {
                          oneOf: [
                            { type: "string" },
                            { type: "number" },
                            { type: "boolean" },
                            { type: "null" }
                          ]
                        }
                      },
                      { type: "string" }
                    ]
                  }
                },
                notes: { type: "string" }
              }
            },
            // progress
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "items"],
              properties: {
                type: { type: "string", enum: ["progress"] },
                title: { type: "string" },
                subhead: { type: "string" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["label", "percent"],
                    properties: {
                      label: { type: "string" },
                      percent: { type: "number", minimum: 0, maximum: 100 }
                    }
                  }
                },
                notes: { type: "string" }
              }
            },
            // quote
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "text", "author"],
              properties: {
                type: { type: "string", enum: ["quote"] },
                title: { type: "string" },
                subhead: { type: "string" },
                text: { type: "string" },
                author: { type: "string" },
                notes: { type: "string" }
              }
            },
            // kpi
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "items"],
              properties: {
                type: { type: "string", enum: ["kpi"] },
                title: { type: "string" },
                subhead: { type: "string" },
                columns: { type: "integer", minimum: 2, maximum: 4 },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["label", "value", "change", "status"],
                    properties: {
                      label: { type: "string" },
                      value: { type: "string" },
                      change: { type: "string" },
                      status: { type: "string", enum: ["good", "bad", "neutral"] }
                    }
                  }
                },
                notes: { type: "string" }
              }
            },
            // bulletCards
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "items"],
              properties: {
                type: { type: "string", enum: ["bulletCards"] },
                title: { type: "string" },
                subhead: { type: "string" },
                items: {
                  type: "array",
                  maxItems: 3,
                  items: {
                    oneOf: [
                      {
                        type: "object",
                        additionalProperties: false,
                        required: ["title"],
                        properties: {
                          title: { type: "string" },
                          desc: { type: "string" }
                        }
                      },
                      { type: "string" }
                    ]
                  }
                },
                notes: { type: "string" }
              }
            },
            // faq
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "items"],
              properties: {
                type: { type: "string", enum: ["faq"] },
                title: { type: "string" },
                subhead: { type: "string" },
                items: {
                  type: "array",
                  items: {
                    oneOf: [
                      {
                        type: "object",
                        additionalProperties: false,
                        required: ["q", "a"],
                        properties: {
                          q: { type: "string" },
                          a: { type: "string" },
                          source: { type: "string" }
                        }
                      },
                      {
                        type: "object",
                        additionalProperties: false,
                        required: ["question", "answer"],
                        properties: {
                          question: { type: "string" },
                          answer: { type: "string" },
                          source: { type: "string" }
                        }
                      },
                      { type: "string" }
                    ]
                  }
                },
                notes: { type: "string" }
              }
            },
            // statsCompare
            {
              type: "object",
              additionalProperties: false,
              required: ["type", "title", "leftTitle", "rightTitle", "stats"],
              properties: {
                type: { type: "string", enum: ["statsCompare"] },
                title: { type: "string" },
                subhead: { type: "string" },
                leftTitle: { type: "string" },
                rightTitle: { type: "string" },
                stats: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["label", "leftValue", "rightValue"],
                    properties: {
                      label: { type: "string" },
                      leftValue: { type: "string" },
                      rightValue: { type: "string" },
                      trend: { type: "string", enum: ["up", "down", "neutral"] }
                    }
                  }
                },
                notes: { type: "string" }
              }
            }
          ]
        }
      }
    }
  };
}
