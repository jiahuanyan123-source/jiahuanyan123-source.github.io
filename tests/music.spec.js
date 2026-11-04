import { test, expect } from "@playwright/test";

test("music catalog renders verified releases, covers and song links", async ({ page }) => {
  await page.goto("/music.html");
  await expect(page).toHaveTitle("音乐作品 | NingQian 宁谦");
  await expect(page.locator("[data-release]")).toHaveCount(18);
  await expect(page.locator("[data-track]")).toHaveCount(35);
  await expect(page.locator("[data-result-count]")).toHaveText("35 首歌曲 / 18 项发行");
  await expect(page.locator(".release-art img").first()).toHaveJSProperty("naturalWidth", 600);
  const urls = await page.locator(".track-name").evaluateAll((links) => links.map((a) => a.href));
  expect(new Set(urls).size).toBe(35);
  expect(urls.every((url) => /^https:\/\/music\.163\.com\/song\?id=\d+$/.test(url))).toBe(true);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
});

test("catalog search, year selection and empty-state reset work together", async ({ page }) => {
  await page.goto("/music.html");
  const search = page.getByRole("searchbox", { name: "搜索歌名或专辑" });
  const year = page.getByRole("combobox", { name: "发行年份" });
  await search.fill("伦敦");
  await expect(page.locator("[data-track]:visible")).toHaveCount(1);
  await expect(page.locator("[data-result-count]")).toHaveText("1 首歌曲 / 1 项发行");
  await year.selectOption("2022");
  await expect(page.locator("[data-empty]")).toBeVisible();
  await page.getByRole("button", { name: "清除筛选" }).click();
  await expect(search).toBeFocused();
  await expect(page.locator("[data-track]:visible")).toHaveCount(35);
  await search.fill("right here again");
  await expect(page.locator("[data-track]:visible")).toHaveCount(1);
  await search.fill("");
  await year.selectOption("2022");
  await expect(page.locator("[data-track]:visible")).toHaveCount(2);
  await year.selectOption("2021");
  await expect(page.locator("[data-track]:visible")).toHaveCount(10);
});

test("home music directory works without JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: testInfo.project.use.viewport, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/#work");
  await page.getByRole("link", { name: "完整作品目录", exact: true }).click();
  await expect(page).toHaveURL(/\/music\.html$/);
  await expect(page.locator("[data-track]")).toHaveCount(35);
  await expect(page.locator("[data-filters]")).toBeHidden();
  await context.close();
});
