import { test, expect } from "@playwright/test";

test("blog featured card renders hero overlay matching design", async ({ page }) => {
  await page.goto("http://localhost:3001/blog");

  // Featured card exists
  const featured = page.locator(".blog-featured");
  await expect(featured).toBeVisible();

  // Hero-style: image covers behind text (media layer fills card)
  const media = featured.locator(".blog-featured-media");
  await expect(media).toBeVisible();

  // Big white title overlaid on image
  const title = featured.locator(".blog-featured-title");
  await expect(title).toBeVisible();
  await expect(title).toHaveText(/\w/);

  // Description overlaid on image
  const desc = featured.locator(".blog-featured-desc");
  await expect(desc).toBeVisible();

  // Stat chips at bottom of overlay
  const stats = featured.locator(".blog-stat");
  await expect(stats.first()).toBeVisible();
  await expect(stats.nth(1)).toBeVisible();

  // Tags as kicker at top of overlay
  const kicker = featured.locator(".blog-featured-kicker");
  await expect(kicker).toBeVisible();

  // No off-white card style: body background is dark (scrim), text is light
  const body = featured.locator(".blog-featured-body");
  await expect(body).toHaveCSS("color", /rgb\(247, 247, 242\)/);

  // Back button present
  const back = page.locator(".portal-back");
  await expect(back).toBeVisible();
});

test("blog post page renders hero cover and body", async ({ page }) => {
  await page.goto("http://localhost:3001/blog");

  // Click first featured article
  await page.locator(".blog-featured").first().click();

  // Post page loads
  await expect(page.locator(".post-page")).toBeVisible();
  await expect(page.locator(".post-title")).toBeVisible();

  // Cover image present
  await expect(page.locator(".post-cover")).toBeVisible();

  // Back link present
  await expect(page.locator(".post-back")).toBeVisible();
});
