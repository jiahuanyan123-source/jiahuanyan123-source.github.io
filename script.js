const root = document.documentElement;
const header = document.querySelector("[data-header]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const workCards = document.querySelectorAll(".work-card");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const caseDialog = document.querySelector("[data-case-dialog]");
const caseClose = document.querySelector("[data-case-close]");
const caseTriggers = document.querySelectorAll("[data-case]");

const caseStudies = {
  "financial-rag-eval": {
    type: "Finance AI / Public repo",
    title: "Financial RAG & Credit Memo Eval",
    summary: "金融文档 RAG 评测公开基线。包含 CLI、单元测试、单/多文档检索评测、Markdown/JSON 报告和 GitHub Actions。",
    role: "问题定义、检索评测、CLI 工程、报告生成",
    focus: "金融文档 RAG、引用溯源、确定性评测",
    year: "2026",
    points: [
      "公开 repo 已包含合成单文档/多文档样本、eval-rag CLI、Markdown/JSON 报告和 GitHub Actions。",
      "报告范围：3 份合成文档、4 个用例、top-k = 5。source-prior 的 line recall@k 为 87.50%，干扰行混入率为 5.00%，用例通过率为 50.00%。",
      "retrieval comparison report 已公开：embedding retrieval 仍标记为 not implemented，没有提前编造指标。",
      "限制：样本是合成文档，不是生产 RAG、不是 LLM benchmark，也不证明信用判断质量。"
    ],
    next: "扩充发行人、模糊名称与无答案用例，冻结评测集；随后在同一 top-k 和指标下比较 embedding 与 source-prior 检索。",
    link: "https://github.com/jiahuanyan123-source/financial-ai-doc-intelligence",
    linkText: "查看 financial-ai-doc-intelligence"
  },
  "crypto-quant-lab": {
    type: "Quant Research / Public repo",
    title: "Crypto Quant Freqtrade Lab",
    summary: "Freqtrade 加密量化研究仓库。已发布公开安全基线，不做收益承诺。",
    role: "Freqtrade 策略工程、dry-run 运营、回测记录、公开版 repo 发布",
    focus: "Freqtrade、OKX futures、dry-run、失败策略归档、风险边界",
    year: "2026",
    points: [
      "已公开策略代码与研究文档；现有 CI 只检查 Python 语法，不验证策略运行或回测质量。",
      "包含 README、结果摘要、策略代码、Moonshot radar 和失败策略记录。",
      "分窗口验证表仍为 pending，历史摘要不等于已完成独立复现或样本外验证。"
    ],
    next: "Python 语法检查 CI、README 复现清单和数据下载指引已完成；下一步补 walk-forward 验证摘要和 exact commands。",
    link: "https://github.com/jiahuanyan123-source/crypto-quant-freqtrade-lab",
    linkText: "查看 crypto-quant-freqtrade-lab"
  },
  "llm-learning-log": {
    type: "Learning Log / Planned",
    title: "LLM Learning Log",
    summary: "LLM、Agent、RAG、评测和开源协作学习记录。待拆成独立 repo。",
    role: "学习规划、代码练习、论文和项目复盘",
    focus: "LLM 应用、Agent、评测、开源贡献",
    year: "2026",
    points: [
      "记录要关联代码、论文、issue、PR 或实验。",
      "记录失败原因和修正过程。",
      "下一步拆成独立 repo，按主题建立索引。"
    ],
    next: "创建第一组学习条目：Git/GitHub、Python 工程、RAG 基础和开源 PR 流程。",
    link: "https://github.com/jiahuanyan123-source",
    linkText: "查看 GitHub 主页"
  },
  "creative-lab": {
    type: "Creative Side Project / Music",
    title: "创作实验室",
    summary: "个人创作副线。已发布网易云音乐单曲。",
    role: "歌曲创作与发布；网易云音乐：闫家欢",
    focus: "个人创造力副线",
    year: "已发布",
    points: [
      "已在网易云音乐发布单曲《把坏天气留在楼下》。",
      "不作为 AI 工程能力的主要证明。",
      "如后续使用 AI 参与创作，会记录工具、流程和人工判断边界。"
    ],
    next: "保留为副线；主线继续优先建设 AI 项目和开源贡献。",
    link: "https://163cn.tv/79f4dcc",
    linkText: "在网易云音乐收听《把坏天气留在楼下》"
  }
};

let previousFocus = null;

function refreshIcons() {
  window.lucide?.createIcons();
}

function updateThemeIcon() {
  if (!themeToggle) return;
  const dark = root.dataset.theme === "dark";
  const label = dark ? "切换到浅色主题" : "切换到深色主题";
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", dark ? "sun" : "moon");
  icon.setAttribute("aria-hidden", "true");
  themeToggle.replaceChildren(icon);
  themeToggle.setAttribute("aria-label", label);
  themeToggle.setAttribute("title", label);
  themeToggle.setAttribute("aria-pressed", String(dark));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#191b1c" : "#ffffff");
  refreshIcons();
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch {
    // Keep controls working when browser storage is unavailable.
  }
  updateThemeIcon();
});

function updateScrollState() {
  const scrollable = root.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  let activeLink = null;
  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.36) activeLink = link;
  });
  // The last section can be too short to reach the usual active-link threshold.
  if (scrollable > 0 && window.scrollY >= scrollable - 2) activeLink = navLinks[navLinks.length - 1];
  header?.classList.toggle("scrolled", window.scrollY > 12);
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  navLinks.forEach((link) => {
    link.classList.toggle("active", link === activeLink);
    if (link === activeLink) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

let scrollFrame = null;
function scheduleScrollState() {
  if (scrollFrame !== null) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = null;
    updateScrollState();
  });
}
window.addEventListener("scroll", scheduleScrollState, { passive: true });
window.addEventListener("resize", scheduleScrollState);
window.addEventListener("pageshow", scheduleScrollState);

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    workCards.forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
    });
    const visibleCount = [...workCards].filter((card) => !card.classList.contains("is-hidden")).length;
    document.querySelector("[data-filter-status]").textContent = `显示 ${visibleCount} 个项目与作品`;
    updateScrollState();
  });
});

function fillCaseDialog(caseStudy) {
  for (const key of ["type", "title", "summary", "role", "focus", "year", "next"]) {
    caseDialog.querySelector(`[data-case-${key}]`).textContent = caseStudy[key];
  }
  const caseLink = caseDialog.querySelector("[data-case-link]");
  caseLink.hidden = !caseStudy.link;
  if (caseStudy.link) {
    caseLink.href = caseStudy.link;
    caseDialog.querySelector("[data-case-link-text]").textContent = caseStudy.linkText || "查看公开作品";
  } else caseLink.removeAttribute("href");

  const pointsList = caseDialog.querySelector("[data-case-points]");
  pointsList.replaceChildren();
  caseStudy.points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    pointsList.append(item);
  });
}

caseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    // Preserve native new-tab and new-window behavior for modified clicks.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const caseStudy = caseStudies[trigger.dataset.case];
    if (!caseDialog || !caseStudy || typeof caseDialog.showModal !== "function") return;
    event.preventDefault();
    previousFocus = trigger;
    fillCaseDialog(caseStudy);
    caseDialog.showModal();
    caseDialog.querySelector(".case-dialog-panel").scrollTop = 0;
    document.body.classList.add("locked");
    refreshIcons();
  });
});
caseClose?.addEventListener("click", () => caseDialog?.close());

caseDialog?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const focusable = [...caseDialog.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')]
    .filter((element) => element.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

function isBackdropEvent(event) {
  if (event.target !== caseDialog) return false;
  const rect = caseDialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
}
let backdropPointerDown = false;
caseDialog?.addEventListener("pointerdown", (event) => { backdropPointerDown = isBackdropEvent(event); });
caseDialog?.addEventListener("click", (event) => {
  if (backdropPointerDown && isBackdropEvent(event)) caseDialog.close();
  backdropPointerDown = false;
});
caseDialog?.addEventListener("close", () => {
  document.body.classList.remove("locked");
  if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
});

updateThemeIcon();
refreshIcons();
updateScrollState();
if (themeToggle) themeToggle.hidden = false;
document.querySelector(".filter-bar")?.removeAttribute("hidden");
