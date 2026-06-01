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
    summary: "面向金融文档的 RAG 与信用研究 memo 项目路线。重点不是做一个泛泛聊天助手，而是验证检索、引用、摘要和结论生成是否可靠。",
    role: "问题定义、数据流程设计、评测框架建设",
    focus: "金融文档 RAG、引用溯源、摘要质量评测",
    year: "2026",
    points: [
      "计划支持金融文档读取、分块、检索、引用定位和 memo 生成。",
      "评测会关注检索命中率、引用准确性、摘要遗漏、幻觉风险和输出可复核性。",
      "当前状态是 Building；公开 repo、示例数据、测试和报告完成后再标记为 Public project。"
    ],
    next: "先完成 v0：样本文档、RAG pipeline、引用输出、基础测试和一份可复现报告。",
    link: "https://github.com/jiahuanyan123-source",
    linkText: "查看 GitHub 主页与后续公开项目"
  },
  "crypto-quant-lab": {
    type: "Quant Research / Planned v0",
    title: "Crypto Quant Lab",
    summary: "一个加密资产量化研究框架，目标是展示数据处理、回测工程、风险指标和研究报告能力，而不是宣传赚钱策略。",
    role: "研究框架设计、Python 工程实现、回测与风险评估",
    focus: "OHLCV 数据、基线策略、手续费/滑点、风险指标",
    year: "2026",
    points: [
      "v0 会从 BTC/ETH 日线数据、均线基线策略和 buy-and-hold 对比开始。",
      "必须显式计入手续费、滑点、最大回撤、夏普、交易次数和样本区间。",
      "不会承诺收益，不做投资建议，不接实盘 API，不保存交易所密钥。"
    ],
    next: "先建立 repo 和 README，再实现数据读取、回测核心、报告生成和最小测试集。",
    link: "https://github.com/jiahuanyan123-source",
    linkText: "查看 GitHub 主页与后续公开项目"
  },
  "llm-learning-log": {
    type: "Learning Log / Ongoing",
    title: "LLM Learning Log",
    summary: "记录 LLM、Agent、RAG、评测、系统工程和开源协作的学习过程。它不是日记式感想，而是项目复盘和知识索引。",
    role: "学习规划、代码练习、论文和项目复盘",
    focus: "LLM 应用、Agent、评测、开源贡献",
    year: "2026",
    points: [
      "每条记录尽量关联代码、论文、issue、PR 或可运行实验。",
      "重点记录失败原因和修正过程，而不是只保存结论。",
      "后续会把学习日志拆进独立 repo，形成可检索的工程学习档案。"
    ],
    next: "先沉淀第一组主题：Git/GitHub、Python 工程、RAG 基础、量化回测和开源 PR 流程。",
    link: "https://github.com/jiahuanyan123-source",
    linkText: "查看 GitHub 主页与后续公开项目"
  },
  "creative-lab": {
    type: "Creative Side Project / 2024",
    title: "创作实验室",
    summary: "以 NingQian / 宁谦的身份保留音乐、小说、短视频和个人表达作为长期副线。",
    role: "音乐发布、小说写作、短视频实验",
    focus: "个人创造力副线",
    year: "2024",
    points: [
      "已在网易云音乐发布单曲《把坏天气留在楼下》。",
      "这个板块展示个人表达和创造力，但不作为 AI 工程能力的主要证明。",
      "后续如果使用 AI 参与创作，会明确记录工具、流程和人工判断边界。"
    ],
    next: "保留为作品集副线；主线仍然优先建设 AI 项目和开源贡献。",
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
