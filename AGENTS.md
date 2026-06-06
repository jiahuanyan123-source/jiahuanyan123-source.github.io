# NingQian Portfolio Agent Instructions

## Final Goal

This project is not just a personal website. It is the evidence hub for NingQian's transition from traditional finance research into AI engineering and applied AI research.

Every update should strengthen one of these signals:

- public, runnable code
- clear README and reproduction steps
- tests, CI, evals, or other verification
- result reports with limitations
- learning logs tied to concrete experiments
- open-source issues, PRs, or review notes

Avoid unsupported claims, vague self-branding, or portfolio copy that sounds stronger than the available evidence.

## Current Portfolio Tracks

- `financial-ai-doc-intelligence`: financial document intelligence, RAG retrieval control, citation evaluation, reports, and CI.
- `crypto-quant-freqtrade-lab`: public-safe Freqtrade research lab, backtest records, risk notes, rejected strategies, and walk-forward validation.
- `llm-learning-log`: planned learning-log repository for LLM, Agent, evaluation, systems engineering, and open-source contribution notes.
- `open-source-log`: planned contribution log for external issues, PRs, review feedback, and retrospectives.

## Working Method

Use this loop for meaningful work:

1. Inspect the current repo and, if needed, the linked GitHub repos.
2. Identify the evidence gap before proposing new copy or design.
3. Make scoped changes that improve project truthfulness, reproducibility, or clarity.
4. Run the strongest available verification.
5. Record what changed and what evidence remains missing.

## Verification Standard

Prefer checks that produce pass/fail or inspectable evidence:

- static portfolio: local browser check, link check, metadata check
- Python projects: tests, CLI smoke run, generated report diff
- quant projects: documented command, timerange, drawdown, trade count, failure notes
- documentation: links resolve, claims match repo state, pending work is labeled pending

Do not treat "looks good" as sufficient when a command, report, or screenshot can verify the change.

## Writing Style

- Be direct and evidence-first.
- Use Chinese for user-facing portfolio copy unless the repository section is intentionally English.
- Keep project claims modest unless backed by code, tests, reports, or public links.
- Preserve creative side-project content as a side track; do not let it dilute the AI engineering portfolio signal.

## Safe Editing Rules

- Never overwrite newer remote portfolio content without checking it first.
- Keep unrelated refactors out of portfolio updates.
- If local files are behind GitHub, prefer adding portable docs or first syncing before editing page copy.
- Keep screenshots and local runtime artifacts out of Git.
