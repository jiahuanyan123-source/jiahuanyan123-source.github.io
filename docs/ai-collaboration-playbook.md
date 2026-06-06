# AI Collaboration Playbook

This playbook turns "codex-maxxing" into a practical workflow for this portfolio and its linked AI projects.

## What Codex-Maxxing Means Here

Codex-maxxing means designing the work so an AI coding agent can reliably help over many sessions. The core idea is simple:

- keep durable project context in files, not memory
- ask for evidence-producing work, not vague improvements
- give the agent runnable checks
- turn repeated workflows into reusable instructions
- review outputs against a clear standard

The goal is not to make the agent sound smart. The goal is to make your GitHub evidence stronger every week.

## The Three-Layer Setup

### 1. Persistent Context

Use `AGENTS.md` as the short, always-relevant project memory:

- final goal
- current tracks
- evidence standard
- verification expectations
- writing style

Keep it short. If it grows too large, move details into docs and link them.

### 2. Repeatable Workflows

Use this document for recurring workflows:

- improve portfolio page
- review a project repo
- add a project report
- prepare a learning log
- create a GitHub profile update

Each workflow should state inputs, steps, checks, and output format.

### 3. Evidence Rubrics

Use `docs/project-evidence-rubric.md` before promoting any item on the homepage. A project should not be described as strong until it has public evidence.

## Prompt Templates

### Project Review Prompt

```text
Review this repo as an AI engineering portfolio artifact.
Focus on evidence quality, reproducibility, README clarity, CI/tests, result reports, and unsupported claims.
Return prioritized fixes and do not make copy sound stronger than the evidence.
```

### Build Sprint Prompt

```text
Take the next small step that makes this repo more verifiable.
Inspect the current files first, choose one scoped improvement, implement it, run checks, and summarize the remaining evidence gap.
```

### Learning Log Prompt

```text
Turn this session into a learning-log entry.
Use this structure: problem, what I tried, what worked, what failed, evidence produced, next experiment.
Keep it tied to code or reports, not general reflection.
```

### Portfolio Update Prompt

```text
Update the portfolio only to reflect public evidence that already exists.
Check linked repos first. If a claim is not backed by a repo, report, CI run, or public link, label it as planned or pending.
```

## Weekly Operating Loop

1. Pick one track: Financial RAG, Crypto Quant, LLM learning log, or open-source contribution.
2. Define one output that can be inspected publicly.
3. Ask Codex to implement or document only that output.
4. Run verification.
5. Update the portfolio only after the evidence exists.

Good weekly outputs:

- one new eval report
- one CLI smoke test
- one CI-backed test improvement
- one walk-forward result table
- one learning-log entry linked to code
- one external issue or PR note

Bad weekly outputs:

- broad rebranding
- more slogans
- new project names without repos
- claims about ability without artifacts
- attractive UI changes that do not improve evidence

## Review Checklist

Before merging or publishing:

- Does the change improve evidence, clarity, or reproducibility?
- Is every strong claim backed by a public artifact?
- Is pending work clearly labeled pending?
- Can a stranger reproduce or inspect the result?
- Did we run the best available check?
- Did we avoid leaking private data, API keys, raw market data, logs, or local databases?

## Sources That Shaped This Workflow

- OpenAI Codex use cases emphasize repeatable workflows such as reviewing PRs, adding evals, keeping docs updated, saving workflows as skills, and running verified operations.
- Anthropic Claude Code best practices emphasize giving the agent a way to verify work, exploring before coding, persistent project instructions, skills, subagents, and adversarial review.

This repo adapts those ideas into a finance-to-AI portfolio evidence system.
