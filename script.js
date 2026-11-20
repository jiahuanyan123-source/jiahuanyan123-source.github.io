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
      "新版公开了非神经哈希检索对照。同一小样本上，不同维度的通过率从 0% 到 100%，结果对参数敏感。",
      "仓库还提供使用虚构文本的文档版本比对演示。检索评测不证明实际业务、神经向量检索或信用判断质量。"
    ],
    next: "扩充发行人、中文和无答案样例；在固定样本和指标下比较检索方法。",
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
      "已公开策略代码和固定窗口回测入口。CI 检查语法、命令与配置，不验证策略运行或回测质量。",
      "包含 README、结果摘要、策略代码、Moonshot radar 和失败策略记录。",
      "分窗口验证表仍为 pending，历史摘要不等于已完成独立复现或样本外验证。"
    ],
    next: "按公开配置实际运行固定窗口回测，记录数据覆盖、命令和结果；目前不将分段回测视为独立样本外验证。",
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
    summary: "持续创作与发布的音乐作品集。网易云音乐公开目录已核对 35 首歌曲、18 项发行记录，涵盖 2021 至 2026 年。",
    role: "歌曲创作与发布",
    focus: "音乐创作、作品积累与发行",
    year: "2021–2026",
    points: [
      "《关于南方的事》收录 10 首歌曲；《到别处生活几天》和《房间里的天气》各收录 5 首。",
      "另有《把晚风调小一点》《把未来挪近一点》《把坏天气留在楼下》《今天也算数》等单曲发行。",
      "目录保留平台标注的作品名称和版本，提供封面、发行日期与逐首收听入口。"
    ],
    next: "继续创作，也逐步整理每一项作品背后的想法与制作手记。",
    link: "music.html",
    linkText: "浏览完整音乐作品目录"
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

