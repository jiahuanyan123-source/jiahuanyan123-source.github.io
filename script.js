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
  "ai-finance-research": {
    type: "Finance AI / 2026",
    title: "AI 金融研究助手",
    summary: "把传统金融研究中的资料整理、信息对比、市场观察和观点沉淀交给 AI 增强，探索更高效的个人投研工作流。",
    role: "金融场景定义、AI 应用设计、研究流程整理",
    focus: "用 AI 增强投研与市场观察",
    year: "2026",
    points: [
      "把研报、新闻、公告和市场数据整理为可比较的输入。",
      "用 AI 做摘要、提问、结构化提取和初步观点生成。",
      "保留人工判断环节，让 AI 成为研究助手，而不是替代决策。"
    ],
    next: "下一步会整理一个真实投研场景，从资料输入到结论输出形成完整案例。"
  },
  "knowledge-automation": {
    type: "Automation / 2025",
    title: "个人知识自动化系统",
    summary: "把 AI 学习、读书笔记、投研材料、生活记录和项目复盘自动归档，形成一个能持续生长的个人知识库。",
    role: "知识结构设计、自动化流程、工具整合",
    focus: "长期知识管理与自动归档",
    year: "2025",
    points: [
      "把输入分成金融、AI、创作、生活和读书几个稳定入口。",
      "减少手动整理成本，让记录可以被搜索、复盘和再利用。",
      "让知识库服务长期转型，而不是变成堆资料的仓库。"
    ],
    next: "下一步会把常用工具链和自动化流程画成图，并沉淀成可复制模板。"
  },
  "ai-learning-log": {
    type: "Learning Log / 2025",
    title: "AI 学习日志",
    summary: "记录从传统金融人士转型为 AI 科学家和高级应用者的路径，包括模型理解、应用实践、工具构建和阶段复盘。",
    role: "学习规划、实践记录、阶段复盘",
    focus: "AI 能力成长路径",
    year: "2025",
    points: [
      "把 AI 学习拆成基础理解、工具实践、场景应用和项目输出。",
      "记录每一阶段的困惑、突破和方法变化。",
      "用真实项目检验学习成果，而不是只停留在课程和概念。"
    ],
    next: "下一步会整理第一组学习日志，围绕 LLM、Agent、自动化和金融场景展开。"
  },
  "creative-lab": {
    type: "Creative Lab / 2024",
    title: "创作实验室",
    summary: "以“闫家欢”的名字在网易云音乐发布单曲《把坏天气留在楼下》，同时把小说写作、短视频和生活记录放进同一个创作空间。",
    role: "音乐发布、小说写作、短视频实验",
    focus: "AI 时代的个人创作与音乐表达",
    year: "2024",
    points: [
      "已在网易云音乐发布单曲《把坏天气留在楼下》。",
      "尝试用 AI 扩展构思、剪辑、配乐和文本生成能力。",
      "让音乐、小说和短视频成为 AI/金融主线之外的长期创作侧面。"
    ],
    next: "下一步会继续沉淀歌曲、歌词、编曲和短视频创作过程。",
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
