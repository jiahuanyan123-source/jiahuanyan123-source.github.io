import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "small-mobile", use: { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } }
  ],
  webServer: {
    command: "python -m http.server 4173 --bind 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false
  }
});
