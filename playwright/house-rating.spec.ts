import { expect, Page, test } from "@playwright/test";

test.use({
  viewport: { width: 430, height: 932 },
  colorScheme: "light"
});

async function advanceQuiz(page: Page) {
  const summaryButton = page.getByRole("button", { name: /Choose your goal/i });

  while (!(await summaryButton.isVisible().catch(() => false))) {
    if (await page.getByRole("button", { name: /Save must-haves/i }).isVisible().catch(() => false)) {
      const chipInput = page.locator(".chip-input").first();
      await chipInput.fill("quiet nights");
      await chipInput.press("Enter");
      await page.getByRole("button", { name: /Save must-haves/i }).click();
      continue;
    }

    if (await page.getByRole("button", { name: /Save dealbreakers/i }).isVisible().catch(() => false)) {
      const chipInput = page.locator(".chip-input").first();
      await chipInput.fill("indoor smoking");
      await chipInput.press("Enter");
      await page.getByRole("button", { name: /Save dealbreakers/i }).click();
      continue;
    }

    await page.locator(".swipe-scale-chip").nth(3).click();
  }
}

async function reachPathChoice(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Demo account/i }).click();
  await page.getByRole("button", { name: /Continue to target city/i }).click();
  await expect(page.getByRole("heading", { name: /Choose where this account is active/i })).toBeVisible();
  await expect(page.getByLabel(/Target city/i)).toHaveValue("Bristol");
  await page.getByRole("button", { name: /Continue to verification/i }).click();
  await expect(page.getByRole("heading", { name: /Confirm the account signal/i })).toBeVisible();
  await page.getByRole("button", { name: /Continue to profile visibility/i }).click();
  await expect(page.getByRole("heading", { name: /Choose who can see this profile before matching starts/i })).toBeVisible();
  await page.getByRole("button", { name: /Continue to commitment level/i }).click();
  await expect(page.getByRole("heading", { name: /Set how ready this account is to move/i })).toBeVisible();
  await page.getByRole("button", { name: /Start lifestyle survey/i }).click();
  await advanceQuiz(page);
  await page.getByRole("button", { name: /Choose your goal/i }).click();
  await expect(page.getByRole("heading", { name: /Choose your goal/i })).toBeVisible();
}

test("shows house ratings on renter listing cards and detail pages", async ({ page }) => {
  await reachPathChoice(page);
  await page.getByRole("button", { name: /Start renter journey/i }).click();

  const sunnyListing = page.locator(".listing-card-button").filter({ hasText: "Sunny room in Clifton terrace" });

  await expect(sunnyListing.getByRole("img", { name: /4\.8 out of 5 from 32 reviews/i })).toBeVisible();
  await sunnyListing.click();

  await expect(page.getByRole("heading", { level: 1, name: /Sunny room in Clifton terrace/i })).toBeVisible();
  await expect(
    page.getByRole("img", { name: /House rating for Sunny room in Clifton terrace: 4\.8 out of 5 from 32 reviews/i })
  ).toBeVisible();
});

test("lets hosts set their own house rating and mirrors it in the listing preview", async ({ page }) => {
  await reachPathChoice(page);
  await page.getByRole("button", { name: /Start owner journey/i }).click();

  const ratingGroup = page.getByRole("group", { name: /Rate your house/i });
  const previewPanel = page.locator(".owner-preview-panel");

  await expect(ratingGroup.getByRole("button")).toHaveCount(5);
  await expect(
    previewPanel.getByRole("img", { name: /Sunny spare room near Clifton Village rating: 4\.7 out of 5/i })
  ).toBeVisible();

  await page.getByRole("button", { name: /Rate your house: 5 stars/i }).click();

  await expect(page.locator(".owner-form-panel .star-rating-copy")).toContainText("5.0");
  await expect(
    previewPanel.getByRole("img", { name: /Sunny spare room near Clifton Village rating: 5\.0 out of 5/i })
  ).toBeVisible();
});
