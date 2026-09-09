import { test, expect } from "@playwright/test";

test("first viewport reveals projects and has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const geometry = await page.evaluate(() => ({
    projectStart: document.querySelector("#work .section-kicker").getBoundingClientRect().top,
    viewportHeight: innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(geometry.projectStart).toBeLessThan(geometry.viewportHeight - 12);
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
});

test("dialog close stays visible after scrolling and focus remains contained", async ({ page }, testInfo) => {
  await page.goto("/#work");
  const trigger = page.locator('[data-case="financial-rag-eval"]');
  await trigger.click();
  const close = page.locator("[data-case-close]");
  await expect(close).toBeFocused();
  const initialClose = await close.boundingBox();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("[data-case-link]")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.locator(".case-dialog-panel").evaluate((el) => { el.scrollTop = el.scrollHeight; });
  const scrolledClose = await close.boundingBox();
  expect(scrolledClose.y).toBe(initialClose.y);
  await expect(close).toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath("scrolled-dialog.png") });
  await close.click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.locator(".case-dialog-panel")).toHaveJSProperty("scrollTop", 0);
  await page.mouse.click(2, 2);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveClass("locked");
});

test("modified project clicks retain native link behavior", async ({ page }) => {
  await page.goto("/#work");
  const prevented = await page.locator('[data-case="financial-rag-eval"]').evaluate((element) => {
    return ["ctrlKey", "metaKey", "shiftKey", "altKey"].map((key) => {
      let intercepted;
      document.addEventListener("click", (event) => {
        intercepted = event.defaultPrevented;
        // Stop only the test navigation, after the application's listener runs.
        event.preventDefault();
      }, { once: true });
      element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, [key]: true }));
      return intercepted;
    });
  });
  expect(prevented).toEqual([false, false, false, false]);
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("stored theme is applied even before the main script loads", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("portfolio-theme", "dark"));
  await page.route("**/script.js?*", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(25, 27, 28)");
});

test("bottom of the page activates contact navigation", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('.site-nav a[href="#contact"]')).toHaveAttribute("aria-current", "location");
  await expect(page.locator("[data-scroll-progress]")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
});

test("browsers without dialog support follow the real repository link", async ({ page }) => {
  await page.addInitScript(() => { HTMLDialogElement.prototype.showModal = undefined; });
  await page.route("https://github.com/**", (route) => route.fulfill({ contentType: "text/html", body: "<title>Repository fallback</title>" }));
  await page.goto("/#work");
  await page.locator('[data-case="financial-rag-eval"]').click();
  await expect(page).toHaveURL("https://github.com/jiahuanyan123-source/financial-ai-doc-intelligence");
});

test("page loads local assets and readable project evidence", async ({ page }, testInfo) => {
  const errors = [];
  const externalRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (new URL(request.url()).hostname !== "127.0.0.1") externalRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page).toHaveTitle("NingQian 宁谦 | AI Engineering Portfolio");
  await expect(page.locator(".hero-image").first()).toHaveJSProperty("naturalWidth", 1536);
  await expect(page.locator("[data-theme-toggle] svg")).toHaveCount(1);
  await expect(page.locator("i[data-lucide]")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("home.png") });
  await page.getByRole("link", { name: "看项目", exact: true }).click();
  await expect(page.locator(".work-card")).toHaveCount(4);
  await expect(page.locator('[data-category="finance"] .case-note')).toContainText("3 份合成文档、4 个用例");
  await expect(page.locator('[data-category="finance"] .case-note')).toContainText("50%");
  await expect(page.locator('[data-category="quant"] .evidence-facts')).toContainText("仅语法检查");
  await expect(page.locator('.report-bars')).toContainText("35%");
  await expect(page.locator('.report-bars')).toContainText("5%");
  await page.screenshot({ path: testInfo.outputPath("projects.png") });
  await page.locator('[data-category="finance"]').screenshot({ path: testInfo.outputPath("financial-project.png") });
  await page.mouse.move(0, 0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("full-page.png"), fullPage: true });
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("theme icon, accessible label and saved preference follow repeated toggles", async ({ page }, testInfo) => {
  await page.goto("/");
  const toggle = page.locator("[data-theme-toggle]");
  for (const theme of ["dark", "light", "dark"]) {
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(toggle).toHaveAttribute("aria-pressed", String(theme === "dark"));
    await expect(toggle).toHaveAttribute("aria-label", theme === "dark" ? "切换到浅色主题" : "切换到深色主题");
    await expect(toggle.locator("svg")).toHaveAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
  }
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(toggle.locator("svg")).toHaveAttribute("data-lucide", "sun");
  await expect(page.locator(".hero-image-dark")).toHaveJSProperty("naturalWidth", 1536);
  await page.screenshot({ path: testInfo.outputPath("dark-home.png") });
  await page.goto("/#work");
  await page.screenshot({ path: testInfo.outputPath("dark-projects.png") });
});

test("filters select the correct cards and restore all projects", async ({ page }) => {
  await page.goto("/#work");
  for (const category of ["finance", "quant", "ai", "creative"]) {
    const button = page.locator(`[data-filter="${category}"]`);
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('.filter-button[aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator(".work-card:visible")).toHaveCount(1);
    await expect(page.locator(".work-card:visible")).toHaveAttribute("data-category", category);
    await expect(page.locator("[data-filter-status]")).toHaveText("显示 1 个项目与作品");
  }
  await page.locator('[data-filter="all"]').click();
  await expect(page.locator(".work-card:visible")).toHaveCount(4);
  await expect(page.locator("[data-filter-status]")).toHaveText("显示 4 个项目与作品");
});

test("all project dialogs open, close and restore keyboard focus", async ({ page }, testInfo) => {
  await page.goto("/#work");
  const dialog = page.getByRole("dialog");
  const cases = [
    ["financial-rag-eval", "Financial RAG & Credit Memo Eval", "https://github.com/jiahuanyan123-source/financial-ai-doc-intelligence"],
    ["crypto-quant-lab", "Crypto Quant Freqtrade Lab", "https://github.com/jiahuanyan123-source/crypto-quant-freqtrade-lab"],
    ["llm-learning-log", "LLM Learning Log", "https://github.com/jiahuanyan123-source"],
    ["creative-lab", "创作实验室", "https://163cn.tv/79f4dcc"]
  ];
  for (const [key, title, url] of cases) {
    const trigger = page.locator(`[data-case="${key}"]`);
    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(dialog.locator("[data-case-link]")).toHaveAttribute("href", url);
    await expect(page.locator("body")).toHaveClass("locked");
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    if (key === "financial-rag-eval") await page.screenshot({ path: testInfo.outputPath("dialog.png") });
    if (key === "creative-lab") await dialog.getByRole("button", { name: "关闭作品详情" }).click();
    else await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveClass("locked");
  }
});

test("report links point to pinned sources and bypass the dialog", async ({ page }) => {
  await page.goto("/#work");
  const report = page.getByRole("link", { name: "评测报告", exact: true });
  await expect(report).toHaveAttribute("href", "https://github.com/jiahuanyan123-source/financial-ai-doc-intelligence/blob/022dc44dc371767865f7d7f2ef9a1e6fb6f380c6/reports/retrieval_comparison.md");
  await page.context().route("https://github.com/**", (route) => route.fulfill({ contentType: "text/html", body: "<title>Report link test</title>" }));
  const popupPromise = page.waitForEvent("popup");
  await report.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/\/022dc44dc371767865f7d7f2ef9a1e6fb6f380c6\/reports\/retrieval_comparison\.md$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await popup.close();
});

test("navigation works at every viewport and text is not clipped", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "主导航" });
  await expect(nav).toBeVisible();
  for (const [label, id] of [["计划", "build"], ["记录", "journal"], ["关于", "about"], ["联系", "contact"], ["项目", "work"]]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    const clearOfHeader = await page.locator(`#${id}`).evaluate((element) => element.getBoundingClientRect().top >= document.querySelector(".site-header").getBoundingClientRect().bottom - 1);
    expect(clearOfHeader).toBe(true);
  }
  const clipped = await page.locator("h1,h2,h3,p,dd,button,.work-links a,.site-nav a").evaluateAll((elements) => elements.filter((el) => el.getClientRects().length && el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent.trim()));
  expect(clipped).toEqual([]);
});

test("restricted storage and missing observer do not break the page", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
    delete window.IntersectionObserver;
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.locator("[data-theme-toggle]").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator('[data-filter="creative"]').click();
  await page.locator('[data-case="creative-lab"]').click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".reveal-pending")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("without JavaScript, cards and evidence links remain usable", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: testInfo.project.use.viewport, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/#work");
  await expect(page.locator(".work-card")).toHaveCount(4);
  await expect(page.locator(".work-card").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".filter-bar")).toBeHidden();
  await expect(page.locator("[data-theme-toggle]")).toBeHidden();
  await expect(page.locator('[data-case="financial-rag-eval"]')).toHaveAttribute("href", "https://github.com/jiahuanyan123-source/financial-ai-doc-intelligence");
  await expect(page.getByRole("link", { name: "评测报告", exact: true })).toBeVisible();
  await context.close();
});
