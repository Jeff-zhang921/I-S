import { expect, Page, test } from "@playwright/test";

test.use({
  viewport: { width: 430, height: 932 },
  colorScheme: "light"
});

async function advanceLifestyleSurvey(page: Page) {
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

async function reachRenterProfile(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Demo account/i }).click();
  await page.getByRole("button", { name: /Continue to target city/i }).click();
  await page.getByRole("button", { name: /Continue to verification/i }).click();
  await page.getByRole("button", { name: /Continue to profile visibility/i }).click();
  await page.getByRole("button", { name: /Continue to commitment level/i }).click();
  await page.getByRole("button", { name: /Start lifestyle survey/i }).click();
  await expect(page.getByRole("list", { name: /Progress/i }).getByText(/^Lifestyle Survey$/i)).toBeVisible();
  await advanceLifestyleSurvey(page);
  await page.getByRole("button", { name: /Choose your goal/i }).click();
  await page.getByRole("button", { name: /Start renter journey/i }).click();
  await page.locator(".bottom-nav").getByRole("button", { name: /^Profile$/i }).click();
  await expect(page.getByRole("heading", { name: /Your renter profile/i })).toBeVisible();
}

test("lets renters edit profile details with save and cancel controls", async ({ page }) => {
  await reachRenterProfile(page);

  await page.getByRole("button", { name: /Edit Profile/i }).click();
  await expect(page.getByRole("heading", { name: /Update renter details/i })).toBeVisible();
  await expect(page.getByLabel(/Full name/i)).toHaveValue("Maya Patel");
  await expect(page.getByLabel(/Email/i)).toHaveValue("maya@bristol.ac.uk");
  await expect(page.getByLabel(/Phone/i)).toHaveValue("(555) 010-1101");
  await expect(page.getByLabel(/Target city/i)).toHaveValue("Bristol");

  await page.getByLabel(/Full name/i).fill("Maya Singh");
  await page.getByLabel(/Target city/i).fill("Leeds");
  await page.getByRole("button", { name: /Save Changes/i }).click();

  await expect(page.getByText(/Profile changes saved/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /Maya Singh/i })).toBeVisible();
  await expect(page.locator(".profile-panel-body").first().getByText(/^Leeds$/i)).toBeVisible();

  await page.getByRole("button", { name: /Edit Profile/i }).click();
  await expect(page.getByLabel(/Target city/i)).toHaveValue("Leeds");
  await page.getByLabel(/Target city/i).fill("Bath");
  await page.getByRole("button", { name: /^Cancel$/i }).click();

  await expect(page.getByRole("heading", { name: /Maya Singh/i })).toBeVisible();
  await expect(page.getByText(/^Bath$/i)).toHaveCount(0);
});
