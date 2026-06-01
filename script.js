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
  "archive-system": {
    type: "Design System / 2026",
    title: "个人档案系统",
    summary: "把作品展示、阶段记录和个人表达整理成一个长期可维护的内容系统，让别人能快速看见你的能力，也能理解你的成长路径。",
    role: "信息架构、视觉方向、内容策略",
    focus: "从作品集升级为个人档案",
    year: "2026",
    points: [
      "用首页建立第一印象，用作品区承载能力证明，用记录区保存长期变化。",
      "把项目标签、年份和阶段说明标准化，方便未来持续添加真实作品。",
      "避免一次性简历式表达，让网站更像一个会更新的个人空间。"
    ],
    next: "替换真实项目图，并为每个项目补充目标、过程、结果和复盘。"
  },
  "recording-tool": {
    type: "Product Concept / 2025",
    title: "记录工具概念",
    summary: "探索一个能把灵感、草稿、作品过程和复盘放在一起的轻量工具，让创作过程本身也能被沉淀。",
    role: "产品设想、原型结构、使用场景",
    focus: "创作过程管理",
    year: "2025",
    points: [
      "把灵感入口做轻，减少记录开始前的心理成本。",
      "让草稿和成品之间有连续链路，而不是分散在不同平台。",
      "通过月度复盘把零散素材变成可回看的判断。"
    ],
    next: "补一张真实产品流程图，展示从灵感到归档的路径。"
  },
  "year-notes": {
    type: "Writing / 2025",
    title: "一年观察笔记",
    summary: "用短文记录自己看见的变化、正在形成的判断和阶段性困惑，让个人表达不只停留在作品结果上。",
    role: "写作、观察、编辑",
    focus: "长期记录与观点沉淀",
    year: "2025",
    points: [
      "每篇只保留一个核心判断，避免记录变成流水账。",
      "用时间线呈现变化，让读者能看见思考的连续性。",
      "把生活观察和项目经验连接起来，形成更完整的个人叙事。"
    ],
    next: "挑选 3 篇最能代表你的文字，做成可阅读的文章详情页。"
  },
  "visual-practice": {
    type: "Visual Practice / 2024",
    title: "视觉练习合集",
    summary: "把分散练习整理为有主题、有节奏的视觉档案，保留审美偏好、排版判断和迭代痕迹。",
    role: "视觉探索、排版、归档",
    focus: "审美系统与形式练习",
    year: "2024",
    points: [
      "把练习按主题归档，而不是只按时间堆放。",
      "保留失败版本和修改理由，让练习变成可学习的资产。",
      "用统一封面系统减少杂乱感，强化整体识别度。"
    ],
    next: "选择 6 到 9 张真实练习图，形成一个更完整的视觉墙。"
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
