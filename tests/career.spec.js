import { test, expect } from "@playwright/test";

test("career overview integrates resume and financing cases by business type", async ({ page }) => {
  await page.goto("/#experience");
  const section = page.locator("#experience");
  await expect(section.locator(".career-group")).toHaveCount(3);
  await expect(section.locator(".career-case")).toHaveCount(12);
  const groupSizes = await section.locator(".career-group").evaluateAll((groups) =>
    groups.map((group) => group.querySelectorAll(".career-case").length)
  );
  expect(groupSizes).toEqual([4, 5, 3]);
  await expect(section.locator("details")).toHaveCount(0);
  for (const item of await section.locator(".career-case").all()) {
    await expect(item).toBeVisible();
    await expect(item.locator("h4")).not.toBeEmpty();
    await expect(item.locator("dl > div")).toHaveCount(3);
    await expect(item.locator(".career-client")).not.toBeEmpty();
  }
  await expect(section.getByRole("heading", { name: "反向保理资产支持计划" })).toBeVisible();
  await expect(section.getByRole("heading", { name: "短窗口系列结构化信托" })).toBeVisible();
  const headings = await section.locator("h2,h3,h4,.section-kicker,.career-stats dt").allTextContents();
  expect(headings.join(" ")).not.toMatch(/20\d{2}|今年|早期/);
});

test("career overview scopes financial claims and remains readable", async ({ page }) => {
  await page.goto("/#experience");
  const section = page.locator("#experience");
  await expect(section.locator(".career-scale-note")).toContainText("约127亿元仅对应2026年10月工作总结中的六项项目登记规模");
  await expect(section.locator(".career-scale-note")).toContainText("不代表全部职业项目累计规模");
  await expect(section.locator(".career-scale-note")).toContainText("不等同于募集或实际投放金额");
  await expect(section.locator(".career-breadth")).toContainText("参与经历，不与独立主导项目混同");
  await expect(section.locator(".career-continuity")).toContainText("储备项目不列为已完成成果");
  const geometry = await section.evaluate((el) => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    clipped: [...el.querySelectorAll("h3,h4,p,dd,dt")].filter((item) =>
      item.getClientRects().length && item.scrollWidth > item.clientWidth + 1
    ).map((item) => item.textContent)
  }));
  expect(geometry).toEqual({ overflow: false, clipped: [] });
});
