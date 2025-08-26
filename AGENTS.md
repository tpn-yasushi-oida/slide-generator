# Repository Guidelines

## Project Structure & Module Organization
- Source: `majin_style/`
  - `main.gs`: Web entry (`doGet`), request orchestration (`runGeneration`).
  - `callGemini.gs`: Gemini API integration (Vertex AI or Direct API), schema, diagnostics.
  - `majin_slide_generator.gs`: Google Slides rendering engine.
  - `index.html`: GAS HtmlService UI (uses `google.script.run`).
  - Docs: `majin_style/docs/` (notably `SPEC.md`, samples, outputs).
- Legacy: `legacy/` contains the earlier implementation kept for reference.

## Build, Test, and Development Commands
- Build: No local build. Develop and run in Google Apps Script (GAS).
- Deploy: GAS → Deploy → Web app. Entry is `doGet()` in `main.gs`.
- Local preview: Opening `majin_style/index.html` in a browser only previews layout; functionality requires GAS (`google.script.run`).
- Diagnostics (run from GAS editor):
  - `diagnoseSettings()` — prints property setup status.
  - `testGeminiConnection()` — validates Gemini connectivity + basic generation.
  - `testSlideDataGeneration()` / `testSlideGeneration()` — quick end‑to‑end checks.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; keep lines concise and readable.
- Quotes: Prefer double quotes in `.gs`/`.html`; single quotes allowed for literals (e.g., font names).
- Naming: `camelCase` for functions/vars (e.g., `runGeneration`), `UPPER_SNAKE_CASE` for constants (e.g., `PROJECT_ID`).
- Modules: Keep responsibilities separated as in current files (API, orchestration, rendering, UI).
- Lint/format: No configured tools; match existing style and comment tone (JP allowed).

## Testing Guidelines
- Framework: None. Use GAS function runs and Logs for verification.
- Test entrypoints: `diagnoseSettings`, `testGeminiConnection`, `testSlideDataGeneration`, `testSlideGeneration`.
- Data validation: `runGeneration` enforces schema via `getSlideDataSchema()` and `validateSlideData_()`; add new slide types only after updating schema and renderer.
- Naming: Test helpers are `test*`/`diagnose*` and live alongside production code.

## Commit & Pull Request Guidelines
- Message style in history uses short prefixes: `add:`, `fix:`, `update:` followed by a brief JP/EN description.
- PRs should include:
  - Clear summary, before/after screenshots for UI changes (`majin_style/index.html`).
  - Linked issue(s) and scope of change (API, rendering, UI).
  - If schema/UI contracts change, update `majin_style/docs/SPEC.md` and note required Script Properties.

## Security & Configuration Tips
- Script Properties (set in GAS → Project Settings):
  - Vertex AI: `PROJECT_ID`, `REGION`, `CLIENT_EMAIL`, `PRIVATE_KEY` (escape newlines as `\n`).
  - Direct API: `GEMINI_API_KEY`.
- Only one path is required; if both are set, Vertex AI takes precedence.
