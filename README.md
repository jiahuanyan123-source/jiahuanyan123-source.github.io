# NingQian / 宁谦 AI Engineering Portfolio

这是我的 GitHub Pages 作品集，用来公开记录从传统金融投研转向 AI 工程与研究应用的过程。这个站点本身不是最终作品，真正重要的是它后续链接的开源项目、实验记录、评测结果和代码贡献。

Live site: [GitHub Pages deployment](https://jiahuanyan123-source.github.io/)

## 当前定位

我会把作品集分成两层：

- Portfolio site: 展示身份定位、项目路线、学习记录和联系方式。
- Project evidence: 用独立 GitHub repo 展示可运行代码、测试、实验报告、复现步骤和局限性。

## AI 协作方法论

这个仓库已经加入一套轻量的 AI coding 工作协议，用来让 Codex 或其他 AI 编程代理持续围绕证据建设，而不是只做表面优化：

- [`AGENTS.md`](AGENTS.md): 项目的长期上下文、最终目标、验证标准和写作边界。
- [`docs/ai-collaboration-playbook.md`](docs/ai-collaboration-playbook.md): Codex-maxxing / agentic coding 的实际工作流、提示词模板和每周循环。
- [`docs/project-evidence-rubric.md`](docs/project-evidence-rubric.md): 项目从 idea 到 external signal 的证据评分表，决定哪些内容可以被放进主页。

## 正在建设的项目方向

- `financial-rag-eval`: 已公开为 `financial-ai-doc-intelligence`。在 3 份合成文档、4 个用例、top-k = 5 的测试集上，source-prior 把干扰行混入率从 35% 降至 5%，用例通过率为 50%；这只代表该测试集上的检索表现。[对照报告](https://github.com/jiahuanyan123-source/financial-ai-doc-intelligence/blob/022dc44dc371767865f7d7f2ef9a1e6fb6f380c6/reports/retrieval_comparison.md)。
- `crypto-quant-lab`: 已公开为 `crypto-quant-freqtrade-lab`，包含策略、历史回测摘要和失败实验。CI 仅检查语法，分窗口验证表尚待填写。
- `llm-learning-log`: 记录 LLM、Agent、评测、系统工程和开源贡献的学习过程。
- Open-source contribution log: 记录未来对真实开源项目的 issue、PR、review 和复盘。

这些项目在未公开代码之前只会标记为 `Building`，不会包装成已经完成。

## 一个项目被放进主页前必须具备

- 可公开访问的 GitHub repo。
- 清晰的 README 和运行方式。
- 至少一组可复现实验或示例输出。
- 基础测试或验证脚本。
- 明确写出局限性和下一步。

## 技术实现

- Static HTML / CSS / JavaScript
- GitHub Pages
- Responsive layout
- Light / dark theme
- Project filtering and case-study dialog

## 本地预览

直接打开 `index.html` 即可使用。页面和 Lucide 图标都在仓库中，不需要安装依赖或启动开发服务器。

## 自动化检查

仅开发与测试需要 Node.js 22+、Python 3 和 Chromium：

```powershell
npm ci
npm run check
npx playwright install chromium
npm test
```

Playwright 会临时启动本地测试服务器，覆盖 7 种视口（1920、1440、1280、768、390、360、320px），检查首屏构图、横向溢出、主题持久化、项目筛选、长弹窗关闭、键盘焦点、组合键点击、导航、报告链接、受限存储及禁用 JavaScript 的情况。包含 98 项浏览器检查，并保留完整页面与交互截图。

[Portfolio checks](https://github.com/jiahuanyan123-source/jiahuanyan123-source.github.io/actions/workflows/portfolio-checks.yml) 在 push / PR 时运行，测试报告和截图保存在该次运行的 `portfolio-browser-checks` artifact 中，保留 14 天。它检查本站交互，不代表已复现两个技术项目的实验结果。

Lucide 固定版本记录在 `package-lock.json` 中。升级时运行 `npm run vendor:icons` 同步页面资源与许可证。

## 部署

这个仓库使用 GitHub Pages 部署。推送到 `main` 分支后，GitHub 会自动更新线上页面。当前 Pages 与测试独立运行；先在 `codex/portfolio-*` 或 `portfolio/` 分支跑完检查并核对截图，再合入 `main`。

## 下一步

1. 扩充 Financial RAG 的发行人、模糊名称与无答案用例，冻结评测集后做 embedding retrieval comparison。
2. 跑 Crypto Quant walk-forward 并填公开结果摘要。
3. 建立 LLM learning log repo。
4. 持续记录开源贡献和学习复盘。

本轮核对记录：[2026-09-09 项目恢复](docs/restart-2026-09-09.md)。

设计与交互改版：[2026-09-09 Studio 改版](docs/design-2026-09-09.md)。
