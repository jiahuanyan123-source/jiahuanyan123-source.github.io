# Project Evidence Rubric

Use this rubric before promoting a project on the homepage or GitHub profile.

## Score Levels

### Level 0: Idea

The project is only a concept.

Evidence:

- project name
- short problem statement
- no public code yet

Homepage label: `Planned`

### Level 1: Public Skeleton

The project has a public repo and a readable README.

Evidence:

- public GitHub repo
- README explains purpose and scope
- basic file structure
- limitations are visible

Homepage label: `Building`

### Level 2: Runnable Baseline

The project can be run or inspected by a stranger.

Evidence:

- setup or quick-start command
- sample input
- sample output or report
- at least one test, smoke check, or CI workflow
- no private data required

Homepage label: `Baseline ready`

### Level 3: Evaluated Artifact

The project has measurable results and failure analysis.

Evidence:

- metrics or comparison report
- reproducible command
- known failure modes
- limitations and next experiment
- CI or test coverage for the core behavior

Homepage label: `Eval improved` or `Validated baseline`

### Level 4: External Signal

The project has external use, review, or contribution evidence.

Evidence:

- external issue or PR
- third-party review
- release
- demo used by someone else
- meaningful stars, forks, or discussion

Homepage label: `External signal`

## Current Track Assessment

| Track | Current Level | Why | Next Level-Up |
| --- | ---: | --- | --- |
| Financial AI Doc Intelligence | 3 | Public repo, CLI, tests, CI, generated reports, retrieval comparison, known failure modes | Add local embedding retrieval comparison and document whether it beats source-prior |
| Crypto Quant Freqtrade Lab | 2 | Public repo, strategy files, syntax CI, result summary, rejected strategies, reproducibility checklist | Fill walk-forward validation table with exact commands and failure notes |
| LLM Learning Log | 0 | Planned but not yet public as a dedicated repo | Create repo with first experiment-linked learning note |
| Open Source Log | 0 | Planned but no external issue or PR yet | Record first external issue, PR, or review attempt |
| Creative Lab | 1 | Public NetEase music link exists, but it is a side track | Keep as side identity; do not promote as AI engineering evidence |

## Promotion Rule

A project card can move up only when the evidence exists in public.

Do not update the homepage first and hope the project catches up. Build the artifact first, then update the portfolio.
