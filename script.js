const root = document.documentElement;
const header = document.querySelector("[data-header]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const workCards = document.querySelectorAll(".work-card");
const reveals = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const caseDialog = document.querySelector("[data-case-dialog]");
const caseClose = document.querySelector("[data-case-close]");
const caseTriggers = document.querySelectorAll("[data-case]");

const caseStudies = {
  "financial-rag-eval": {
    type: "Finance AI / Building",
    title: "Financial RAG & Credit Memo Eval",
    summary: "金融文档 RAG 评测项目。当前还没有公开 repo。",
    role: "问题定义、数据流程设计、评测框架",
    focus: "金融文档 RAG、引用溯源、摘要质量评测",
    year: "2026",
    points: [
      "目标 v0：样本文档、检索 pipeline、引用输出和评测报告。",
      "评测关注检索命中率、引用准确性、摘要遗漏和幻觉风险。",
      "状态：Building；公开 repo 完成后再更新为 Public project。"
    ],
    next: "创建 v0 repo，提交样本文档、基础 pipeline 和 citation report。",
    link: "https://github.com/jiahuanyan123-source",
    linkText: "查看 GitHub 主页"
  },
  "crypto-quant-lab": {
    type: "Quant Research / Public repo",
    title: "Crypto Quant Freqtrade Lab",
    summary: "Freqtrade 加密量化研究仓库。已发布公开安全基线，不做收益承诺。",
    role: "Freqtrade 策略工程、dry-run 运营、回测记录、公开版 repo 发布",
    focus: "Freqtrade、OKX futures、dry-run、失败策略归档、风险边界",
    year: "2026",
    points: [
      "GitHub main 已发布 26 个公开安全基线文件。",
      "包含 README、结果摘要、策略代码、Moonshot radar 和失败策略记录。",
      "未发布数据、日志、SQLite、backtest zip、内部 handoff 或真实配置。"
    ],
    next: "Python 语法检查 CI、README 复现清单和数据下载指引已完成；下一步补 walk-forward 验证摘要和 exact commands。",
    link: "https://github.com/jiahuanyan123-source/crypto-quant-freqtrade-lab",
    linkText: "查看 crypto-quant-freqtrade-lab"
  },
  "llm-learning-log": {
    type: "Learning Log / Ongoing",
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
    type: "Creative Side Project / 2024",
    title: "创作实验室",
    summary: "个人创作副线。已发布网易云音乐单曲。",
    role: "音乐发布、小说写作、短视频实验",
    focus: "个人创造力副线",
    year: "2024",
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

const storedTheme = localStorage.getItem("portfolio-theme");
if (storedTheme) {
  root.dataset.theme = storedTheme;
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateThemeIcon() {
  const icon = themeToggle?.querySelector("i");
  if (!icon) return;
  icon.setAttribute("data-lucide", root.dataset.theme === "dark" ? "sun" : "moon");
  refreshIcons();
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeIcon();
});

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  let activeLink = null;
  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.36) {
      activeLink = link;
    }
  });

  header?.classList.toggle("scrolled", window.scrollY > 12);
  if (scrollProgress) {
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  }
  navLinks.forEach((link) => {
    link.classList.toggle("active", link === activeLink);
  });
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", button.classList.contains("active").toString());

  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", (item === button).toString());
    });

    workCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

function fillCaseDialog(caseStudy) {
  caseDialog.querySelector("[data-case-type]").textContent = caseStudy.type;
  caseDialog.querySelector("[data-case-title]").textContent = caseStudy.title;
  caseDialog.querySelector("[data-case-summary]").textContent = caseStudy.summary;
  caseDialog.querySelector("[data-case-role]").textContent = caseStudy.role;
  caseDialog.querySelector("[data-case-focus]").textContent = caseStudy.focus;
  caseDialog.querySelector("[data-case-year]").textContent = caseStudy.year;
  caseDialog.querySelector("[data-case-next]").textContent = caseStudy.next;

  const caseLink = caseDialog.querySelector("[data-case-link]");
  const caseLinkText = caseDialog.querySelector("[data-case-link-text]");
  if (caseStudy.link) {
    caseLink.href = caseStudy.link;
    caseLinkText.textContent = caseStudy.linkText || "查看公开作品";
    caseLink.hidden = false;
  } else {
    caseLink.hidden = true;
    caseLink.removeAttribute("href");
  }

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
    const caseStudy = caseStudies[trigger.dataset.case];
    if (!caseDialog || !caseStudy) return;

    event.preventDefault();
    previousFocus = document.activeElement;
    fillCaseDialog(caseStudy);

    if (typeof caseDialog.showModal === "function") {
      caseDialog.showModal();
    } else {
      caseDialog.setAttribute("open", "");
    }
    document.body.classList.add("locked");
    refreshIcons();
  });
});

caseClose?.addEventListener("click", () => caseDialog?.close());

caseDialog?.addEventListener("click", (event) => {
  if (event.target === caseDialog) {
    caseDialog.close();
  }
});

caseDialog?.addEventListener("close", () => {
  document.body.classList.remove("locked");
  if (previousFocus instanceof HTMLElement) {
    previousFocus.focus();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((item) => observer.observe(item));

updateThemeIcon();
refreshIcons();
updateScrollState();
