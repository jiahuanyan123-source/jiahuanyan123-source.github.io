# NingQian / 宁谦 AI Engineering Portfolio

这是我的 GitHub Pages 作品集，用来公开记录从传统金融投研转向 AI 工程与研究应用的过程。这个站点本身不是最终作品，真正重要的是它后续链接的开源项目、实验记录、评测结果和代码贡献。

Live site: [GitHub Pages deployment](https://jiahuanyan123-source.github.io/)

## 当前定位

我会把作品集分成两层：

- Portfolio site: 展示身份定位、项目路线、学习记录和联系方式。
- Project evidence: 用独立 GitHub repo 展示可运行代码、测试、实验报告、复现步骤和局限性。

## 正在建设的项目方向

- `financial-rag-eval`: 已公开为 `financial-ai-doc-intelligence`，包含金融文档 RAG 评测、CLI、单/多文档检索评测、报告和 CI；retrieval comparison report 已公开，source-prior 版本把 multi-doc distractor leak 从 35.00% 降到 5.00%。
- `crypto-quant-lab`: 加密资产量化研究框架，先做数据、回测、手续费/滑点、风险指标和报告生成。
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

```powershell
python -m http.server 5173
```

然后打开：

```text
http://localhost:5173
```

## 部署

这个仓库使用 GitHub Pages 部署。推送到 `main` 分支后，GitHub 会自动更新线上页面。

## 下一步

1. 给 Financial RAG 做 local embedding retrieval comparison。
2. 跑 Crypto Quant walk-forward 并填公开结果摘要。
3. 建立 LLM learning log repo。
4. 持续记录开源贡献和学习复盘。
