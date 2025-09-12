const mockUserInput = `
# 生成AIプレゼン（初心者向け・共感重視・60分）

狙い：難しい話は最小限。現場の「あるある」を“ビフォー/アフター”で可視化 → すぐ試す気持ちを作る。

---

## 0. つかみ（2分）
- 今日のゴール：①現場での使いどころが分かる ②1つパイロットを決める
- 進め方：対比 → 体験 → 安全 → 明日からの手順

---

## 1. 会議運営の対比（5分）
**Before**
- 30分会議 × 5本/日。議事録は手書き→清書で夜に残業  
- 決定事項が埋もれ、誰がやるか曖昧

**After（生成AI併用）**
- 会議録音→「要点/決定/ToDo/担当/期限」を自動抽出  
- 会議後5分で配信。抜け漏れは人が最終確認

使い方の一言：Zoom/Teamsの文字起こし＋AI要約→テンプレ配信

参考URL
- [Forrester：M365 Copilot ROI](https://tei.forrester.com/go/microsoft/M365Copilot/?lang=en-us)
- [Google：Gemini 2.5（I/O 2025）](https://blog.google/technology/google-deepmind/google-gemini-updates-io-2025/)

---

## 2. メール/資料初稿づくりの対比（6分）
**Before**
- 事例集を探し回る→白紙から着手→表現修正で往復

**After**
- 目的と読者、素材リンクを渡す→“雛形/骨子/箇条書き”が数分で生成  
- 内容チェックと社内用語への調整に集中

使い方の一言：社内テンプレ＋過去資料のフォルダをRAGで参照させる

参考URL
- [GitHub：効果測定ガイド](https://resources.github.com/learn/pathways/copilot/essentials/measuring-the-impact-of-github-copilot/)
- [McKinsey：State of AI 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)

---

## 3. 顧客対応（CS/営業チャット）の対比（6分）
**Before**
- FAQが散在。新人は回答に時間。属人化

**After**
- 問い合わせ文→関連ナレッジを根拠付きで提示  
- トーンや禁止表現をガードレールで統一

使い方の一言：FAQと手順書を索引化。回答は「根拠URL＋引用」を必須

参考URL
- [NBER：Generative AI at Work（14%向上）](https://www.nber.org/papers/w31161)
- [OWASP：LLMアプリ Top10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

---

## 4. エンジニアの日常（コード/設計レビュー）の対比（6分）
**Before**
- 小修正PRの説明に時間。テスト雛形は毎回手書き

**After**
- 変更差分から要約/影響範囲/テスト観点を自動下書き  
- 人は設計判断とリスク潰しに専念

使い方の一言：リポジトリを読み込ませ、PRテンプレをAIで生成→人が確定

参考URL
- [GitHub×Accenture：生産性レポート](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/)
- [METR：経験者RCT（注意点）](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)

---

## 5. 営業提案の対比（6分）
**Before**
- 過去提案の横展開に時間。競合比較が手作業

**After**
- 要件→“課題→解決策→価値→見積り骨子”を提示  
- 競合比較表を自動叩き台化。法務/表現は人が監修

使い方の一言：過去提案・導入事例・価格表のRAG化＋禁句リストで安全運用

参考URL
- [Salesforce：Einstein Copilot](https://www.salesforce.com/au/news/stories/about-einstein-copilot/)
- [SAP：Joule 概要](https://www.sap.com/taiwan/products/artificial-intelligence/generative-ai.html)

---

## 6. 現場デモ台本（10分）
- **デモ1：会議要約**  
  ①録音ファイル投入 → ②要点/決定/ToDo抽出 → ③配信テンプレで出力  
- **デモ2：資料の“骨子”生成**  
  ①目的/読者/素材URL入力 → ②目次＋箇条書き生成 → ③人が推敲  
- **デモ3：社内ナレッジ回答**  
  ①質問 → ②根拠リンク付き回答 → ③信頼度と出典を画面に表示

ヒント：出典リンクは常に表示。人の最終承認を入れる

---

## 7. 安全とルール（6分）
**最低限の約束**
- 機密の“外部送信禁止”設定を徹底
- 出力は**人が最終確認**（重要）
- 出典リンクの添付を義務化
- 教育：NG表現、個人情報、著作権

参考URL
- [AI事業者GL 1.1（チェックリスト）](https://www.meti.go.jp/shingikai/mono_info_service/ai_shakai_jisso/pdf/20250328_3.pdf)
- [デジタル庁：行政の生成AI GL](https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/e2a06143-ed29-4f1d-9c31-0f06fca67afc/80419aea/20250527_resources_standard_guidelines_guideline_01.pdf)
- [文化庁：AIと著作権](https://www.bunka.go.jp/seisaku/chosakuken/aiandcopyright.html)

---

## 8. よくある失敗 → 回避策（5分）
- **黒箱化** → “プロンプト＋データ＋出典”をログに残す  
- **幻覚** → 重要回答は“根拠表示＋人の承認”  
- **PoC止まり** → KPIと期限を先に決める（下記参照）

参考URL
- [OWASP：LLM Top10 2025 PDF](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)

---

## 9. 成果の測り方（3分）
**KPI例**
- ドラフト到達時間、案件/時、一次解決率、FAQ自己解決率、NPS  
- 4週間で“時間△”と“品質○/×”をセットで記録

参考URL
- [GitHub：測定ガイド](https://resources.github.com/learn/pathways/copilot/essentials/measuring-the-impact-of-github-copilot/)
- [Forrester：M365 Copilot TEI](https://tei.forrester.com/go/microsoft/M365Copilot/?lang=en-us)

---

## 10. 4週間パイロット計画（6分）
- **W1**：対象業務を3つ選ぶ（会議要約/FAQ/資料骨子）  
- **W2**：データ接続と最小RAG、NGワード/禁送信設定  
- **W3**：20名で本番同等に試す。KPIを日次で収集  
- **W4**：可否判定。運用ルール・教育・監査ログを整備

参考URL
- [Vertex AI：RAG 概要](https://cloud.google.com/vertex-ai/generative-ai/docs/rag-engine/rag-overview)
- [Azure：RAG 設計ガイド](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide)

---

## 11. モデル地図（要点だけ）（3分）
- GPT系（OpenAI）、Claude系（Anthropic）、Gemini系（Google）、Llama系（Meta）  
- 得意分野が違う。**業務×得意**で使い分け

参考URL
- [OpenAI：GPT-5](https://openai.com/index/introducing-gpt-5/)
- [Anthropic：Claude 3.7 Sonnet](https://www.anthropic.com/news/claude-3-7-sonnet)
- [Google：Gemini 2.5](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/)
- [Meta：Llama 4](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)

---

## 12. クロージング（5分）
- 今日の要点：  
  ①“下書き生成＋根拠表示＋人の承認”で安全に速くなる  
  ②デモの3業務から始めるのが最短  
- **この場で決める**：パイロット責任者、対象3業務、KPI、開始日

---

## 付録：国内事例リンク
- [NEC：社内活用（論文/講演）](https://jpn.nec.com/techrep/journal/g23/n02/230208.html)
- [日立：保守問い合わせAIエージェント](https://www.hitachi.co.jp/New/cnews/month/2025/03/0326.html)

## 付録：規制・標準リンク
- [EU：AI Act 概要](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
- [AI Act 実装タイムライン](https://artificialintelligenceact.eu/implementation-timeline/)
- [ISO：ISO/IEC 42001](https://www.iso.org/standard/42001)

`


const mockSlideData = [
    {
      "type": "title",
      "title": "生成AIプレゼン（初心者向け・共感重視）",
      "date": "2024.07.26",
      "notes": "プレゼンのタイトルスライドです。対象者と目的を明確に示します。"
    },
    {
      "type": "content",
      "title": "アジェンダ",
      "points": [
        "会議運営の対比",
        "メール/資料初稿づくりの対比",
        "顧客対応（CS/営業チャット）の対比",
        "エンジニアの日常（コード/設計レビュー）の対比",
        "営業提案の対比",
        "現場デモ台本",
        "安全とルール",
        "よくある失敗 回避策",
        "成果の測り方",
        "4週間パイロット計画",
        "モデル地図",
        "クロージング"
      ],
      "notes": "プレゼンの全体像を示すアジェンダです。各セクションへの期待感を高めます。"
    },
    {
      "type": "section",
      "title": "会議運営",
      "sectionNo": 1,
      "notes": "会議運営における生成AIの活用について説明します。"
    },
    {
      "type": "compare",
      "title": "会議運営の対比",
      "subhead": "生成AI併用による効率化",
      "leftTitle": "Before",
      "rightTitle": "After",
      "leftItems": [
        "30分会議 × 5本/日",
        "議事録は手書き清書で夜に残業",
        "決定事項が埋もれ、誰がやるか曖昧"
      ],
      "rightItems": [
        "会議録音「要点/決定/ToDo/担当/期限」を自動抽出",
        "会議後5分で配信。抜け漏れは人が最終確認"
      ],
      "notes": "会議運営におけるBefore/Afterを比較し、生成AI導入の効果を具体的に示します。Zoom/Teamsの文字起こし＋AI要約テンプレ配信"
    },
    {
      "type": "section",
      "title": "メール/資料作成",
      "sectionNo": 2,
      "notes": "メール/資料作成における生成AIの活用について説明します。"
    },
    {
      "type": "compare",
      "title": "メール/資料初稿づくりの対比",
      "subhead": "生成AIによる効率化",
      "leftTitle": "Before",
      "rightTitle": "After",
      "leftItems": [
        "事例集を探し回る白紙から着手表現修正で往復"
      ],
      "rightItems": [
        "目的と読者、素材リンクを渡す“雛形/骨子/箇条書き”が数分で生成",
        "内容チェックと社内用語への調整に集中"
      ],
      "notes": "メール/資料作成におけるBefore/Afterを比較し、生成AI導入の効果を具体的に示します。社内テンプレ＋過去資料のフォルダをRAGで参照させる"
    },
    {
      "type": "section",
      "title": "顧客対応",
      "sectionNo": 3,
      "notes": "顧客対応における生成AIの活用について説明します。"
    },
    {
      "type": "compare",
      "title": "顧客対応（CS/営業チャット）の対比",
      "subhead": "生成AIによる効率化と品質向上",
      "leftTitle": "Before",
      "rightTitle": "After",
      "leftItems": [
        "FAQが散在。新人は回答に時間。属人化"
      ],
      "rightItems": [
        "問い合わせ文関連ナレッジを根拠付きで提示",
        "トーンや禁止表現をガードレールで統一"
      ],
      "notes": "顧客対応におけるBefore/Afterを比較し、生成AI導入の効果を具体的に示します。FAQと手順書を索引化。回答は「根拠URL＋引用」を必須"
    },
    {
      "type": "section",
      "title": "エンジニアの日常",
      "sectionNo": 4,
      "notes": "エンジニアの日常業務における生成AIの活用について説明します。"
    },
    {
      "type": "compare",
      "title": "エンジニアの日常（コード/設計レビュー）の対比",
      "subhead": "生成AIによる効率化と品質向上",
      "leftTitle": "Before",
      "rightTitle": "After",
      "leftItems": [
        "小修正PRの説明に時間。テスト雛形は毎回手書き"
      ],
      "rightItems": [
        "変更差分から要約/影響範囲/テスト観点を自動下書き",
        "人は設計判断とリスク潰しに専念"
      ],
      "notes": "エンジニアの日常業務におけるBefore/Afterを比較し、生成AI導入の効果を具体的に示します。リポジトリを読み込ませ、PRテンプレをAIで生成人が確定"
    },
    {
      "type": "section",
      "title": "営業提案",
      "sectionNo": 5,
      "notes": "営業提案における生成AIの活用について説明します。"
    },
    {
      "type": "compare",
      "title": "営業提案の対比",
      "subhead": "生成AIによる効率化と品質向上",
      "leftTitle": "Before",
      "rightTitle": "After",
      "leftItems": [
        "過去提案の横展開に時間。競合比較が手作業"
      ],
      "rightItems": [
        "要件“課題解決策価値見積り骨子”を提示",
        "競合比較表を自動叩き台化。法務/表現は人が監修"
      ],
      "notes": "営業提案におけるBefore/Afterを比較し、生成AI導入の効果を具体的に示します。過去提案・導入事例・価格表のRAG化＋禁句リストで安全運用"
    },
    {
      "type": "section",
      "title": "現場デモ",
      "sectionNo": 6,
      "notes": "生成AIの現場デモについて説明します。"
    },
    {
      "type": "content",
      "title": "現場デモ台本",
      "points": [
        "**デモ1：会議要約** ①録音ファイル投入 ②要点/決定/ToDo抽出 ③配信テンプレで出力",
        "**デモ2：資料の“骨子”生成** ①目的/読者/素材URL入力 ②目次＋箇条書き生成 ③人が推敲",
        "**デモ3：社内ナレッジ回答** ①質問 ②根拠リンク付き回答 ③信頼度と出典を画面に表示"
      ],
      "notes": "3つのデモの台本を示します。出典リンクは常に表示。人の最終承認を入れる"
    },
    {
      "type": "section",
      "title": "安全とルール",
      "sectionNo": 7,
      "notes": "生成AI利用における安全とルールについて説明します。"
    },
    {
      "type": "content",
      "title": "安全とルール",
      "points": [
        "機密の“外部送信禁止”設定を徹底",
        "出力は**人が最終確認**（重要）",
        "出典リンクの添付を義務化",
        "教育：NG表現、個人情報、著作権"
      ],
      "notes": "生成AI利用における最低限の約束を示します。"
    },
    {
      "type": "section",
      "title": "よくある失敗と回避策",
      "sectionNo": 8,
      "notes": "生成AI利用におけるよくある失敗と回避策について説明します。"
    },
    {
      "type": "content",
      "title": "よくある失敗 回避策",
      "points": [
        "**黒箱化** “プロンプト＋データ＋出典”をログに残す",
        "**幻覚** 重要回答は“根拠表示＋人の承認”",
        "**PoC止まり** KPIと期限を先に決める"
      ],
      "notes": "生成AI利用におけるよくある失敗と回避策を示します。"
    },
    {
      "type": "section",
      "title": "成果の測り方",
      "sectionNo": 9,
      "notes": "生成AI導入による成果の測り方について説明します。"
    },
    {
      "type": "content",
      "title": "成果の測り方",
      "points": [
        "ドラフト到達時間、案件/時、一次解決率、FAQ自己解決率、NPS",
        "4週間で“時間△”と“品質○/×”をセットで記録"
      ],
      "notes": "生成AI導入による成果のKPI例を示します。"
    },
    {
      "type": "section",
      "title": "パイロット計画",
      "sectionNo": 10,
      "notes": "4週間のパイロット計画について説明します。"
    },
    {
      "type": "content",
      "title": "4週間パイロット計画",
      "points": [
        "**W1**：対象業務を3つ選ぶ（会議要約/FAQ/資料骨子）",
        "**W2**：データ接続と最小RAG、NGワード/禁送信設定",
        "**W3**：20名で本番同等に試す。KPIを日次で収集",
        "**W4**：可否判定。運用ルール・教育・監査ログを整備"
      ],
      "notes": "4週間のパイロット計画を示します。"
    },
    {
      "type": "section",
      "title": "モデル地図",
      "sectionNo": 11,
      "notes": "生成AIモデルの地図について説明します。"
    },
    {
      "type": "content",
      "title": "モデル地図",
      "points": [
        "GPT系（OpenAI）、Claude系（Anthropic）、Gemini系（Google）、Llama系（Meta）",
        "得意分野が違う。**業務×得意**で使い分け"
      ],
      "notes": "主要な生成AIモデルを紹介します。"
    },
    {
      "type": "closing",
      "notes": "まとめのスライドです。本日の要点：①“下書き生成＋根拠表示＋人の承認”で安全に速くなる ②デモの3業務から始めるのが最短 この場で決める：パイロット責任者、対象3業務、KPI、開始日"
    }
];