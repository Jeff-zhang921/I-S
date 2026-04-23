import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 430, height: 932 },
  colorScheme: "light"
});

test("Save & Quit persists questionnaire progress and ends the current session", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: /Demo account/i }).click();
  await page.getByRole("button", { name: /Continue to target city/i }).click();
  await page.getByRole("button", { name: /Continue to verification/i }).click();
  await page.getByRole("button", { name: /Continue to profile visibility/i }).click();
  await page.getByRole("button", { name: /Continue to commitment level/i }).click();
  await page.getByRole("button", { name: /Start questionnaire/i }).click();

  await expect(page.locator(".question-card-active")).toBeVisible();
  await page.getByRole("button", { name: /Save & Quit/i }).click();

  await expect(page.getByRole("heading", { name: /Launch the profile/i })).toBeVisible();
  await expect(page.getByText(/Progress saved\. You have been signed out/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Resume draft/i })).toBeVisible();

  await page.getByRole("button", { name: /Resume draft/i }).click();
  await expect(page.locator(".question-card-active")).toBeVisible();
});
