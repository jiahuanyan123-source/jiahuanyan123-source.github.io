const root = document.documentElement;
const header = document.querySelector("[data-header]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const workCards = document.querySelectorAll(".work-card");
const reveals = document.querySelectorAll(".reveal");

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
  header?.classList.toggle("scrolled", window.scrollY > 12);
  if (scrollProgress) {
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  }
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    workCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
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
