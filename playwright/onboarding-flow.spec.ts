import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 430, height: 932 },
  colorScheme: "light"
});

test("routes from verification into profile visibility and commitment without government ID upload", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.getByLabel(/Full name/i).fill("Avery Johnson");
  await page.getByLabel(/Email/i).fill("avery@example.com");
  await page.getByLabel(/Phone/i).fill("(555) 010-1234");
  await page.getByLabel(/Password/i).fill("demo1234");
  await page.getByRole("button", { name: /Continue to target city/i }).click();

  await expect(page.getByRole("heading", { name: /Choose where this account is active/i })).toBeVisible();
  await page.getByLabel(/Target city/i).fill("Leeds");
  await page.getByRole("button", { name: /Continue to verification/i }).click();

  await expect(page.getByRole("heading", { name: /Confirm the account signal/i })).toBeVisible();
  await expect(page.getByText(/Government ID/i)).toHaveCount(0);
  await page.getByRole("button", { name: /^Back$/i }).click();

  await expect(page.getByRole("heading", { name: /Choose where this account is active/i })).toBeVisible();
  await expect(page.getByLabel(/Target city/i)).toHaveValue("Leeds");

  await page.getByRole("button", { name: /Continue to verification/i }).click();
  await page.getByRole("button", { name: /Continue to profile visibility/i }).click();

  await expect(page.getByRole("heading", { name: /Choose who can see this profile before matching starts/i })).toBeVisible();
  await page.getByRole("radio", { name: /Hidden Until You Reach Out/i }).click();
  await page.getByRole("button", { name: /Continue to commitment level/i }).click();

  await expect(page.getByRole("heading", { name: /Set how ready this account is to move/i })).toBeVisible();
  await page.getByRole("radio", { name: /Ready/i }).click();
  await page.getByRole("button", { name: /^Back$/i }).click();

  await expect(page.getByRole("heading", { name: /Choose who can see this profile before matching starts/i })).toBeVisible();
});
