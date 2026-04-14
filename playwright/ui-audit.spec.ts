import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const baseURL = "http://127.0.0.1:4176";
const outputDir = path.resolve("playwright-audit");

type AuditEntry = {
  screen: string;
  screenshot: string;
  clientWidth: number;
  scrollWidth: number;
  overflowX: number;
  clippedElements: string[];
};

test.use({
  viewport: { width: 430, height: 932 },
  colorScheme: "light"
});

test.describe("Roommate Match UI audit", () => {
  test.setTimeout(300_000);

  test("captures every primary screen in renter and owner flows", async ({ page }) => {
    const entries: AuditEntry[] = [];

    fs.mkdirSync(outputDir, { recursive: true });

    async function isVisible(name: RegExp | string) {
      return page.getByRole("button", { name }).isVisible().catch(() => false);
    }

    async function expectTopBack(name: RegExp | string) {
      const backButton = page.getByRole("button", { name }).first();

      await expect(backButton).toBeVisible();

      const box = await backButton.boundingBox();
      expect(box, `Expected top back button "${String(name)}" to have a bounding box`).not.toBeNull();
      expect(box!.x).toBeLessThan(120);
      expect(box!.y).toBeLessThan(360);
    }

    async function capture(screen: string) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator("body")).toBeVisible();

      const screenshot = path.join(outputDir, `${screen}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });

      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const clippedElements = Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const text = element.innerText?.trim().replace(/\s+/g, " ").slice(0, 50) ?? "";
            const label = text || element.getAttribute("aria-label") || element.className || element.tagName;

            if (rect.width === 0 || rect.height === 0) {
              return null;
            }

            if (rect.left < -1 || rect.right > window.innerWidth + 1) {
              return `${element.tagName.toLowerCase()}: ${label}`;
            }

            return null;
          })
          .filter((value): value is string => Boolean(value))
          .slice(0, 8);

        return {
          clientWidth: doc.clientWidth,
          scrollWidth: doc.scrollWidth,
          overflowX: Math.max(0, doc.scrollWidth - doc.clientWidth),
          clippedElements
        };
      });

      entries.push({
        screen,
        screenshot,
        ...metrics
      });
    }

    async function advanceQuiz() {
      const summaryButton = page.getByRole("button", { name: /Continue to branch/i });

      while (!(await summaryButton.isVisible().catch(() => false))) {
        const prompt = page.locator(".question-card-active h3");
        const previousPrompt = (await prompt.textContent())?.trim() ?? "";

        if (await isVisible(/Save must-haves/i)) {
          await page.locator("textarea").fill("quiet nights, clean kitchen, walkable commute");
          await page.getByRole("button", { name: /Save must-haves/i }).click();
        } else if (await isVisible(/Save dealbreakers/i)) {
          await page.locator("textarea").fill("indoor smoking, unpaid rent, surprise guests");
          await page.getByRole("button", { name: /Save dealbreakers/i }).click();
        } else {
          const chips = page.locator(".swipe-scale-chip");
          await expect(chips).toHaveCount(5);
          await chips.nth(3).click();
        }

        await expect
          .poll(async () => {
            if (await summaryButton.isVisible().catch(() => false)) {
              return "summary";
            }

            return ((await prompt.textContent()) ?? "").trim();
          })
          .not.toBe(previousPrompt);
      }
    }

    async function completeOnboarding() {
      await page.goto(baseURL, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: /Launch the profile/i })).toBeVisible();
      await capture("01-account");

      await page.getByRole("button", { name: /Demo account/i }).click();
      await page.getByRole("button", { name: /Continue to verification/i }).click();

      await expect(page.getByRole("heading", { name: /Confirm the account signal/i })).toBeVisible();
      await expectTopBack(/^Back$/i);
      await capture("02-verify");

      await page.getByRole("button", { name: /Start questionnaire/i }).click();
      await expect(page.locator(".question-card-active")).toBeVisible();
      await expectTopBack(/^Back$/i);
      await capture("03-quiz");

      await advanceQuiz();
      await expect(page.getByRole("button", { name: /Continue to branch/i })).toBeVisible();
      await expectTopBack(/Back to questions/i);
      await capture("04-summary");

      await page.getByRole("button", { name: /Continue to branch/i }).click();
      await expect(page.getByRole("heading", { name: /Choose where the live experience branches/i })).toBeVisible();
      await expectTopBack(/Back to profile/i);
      await capture("05-path-choice");
    }

    async function runRenterFlow() {
      await page.getByRole("button", { name: /Start renter journey/i }).click();
      await expect(page.getByRole("heading", { name: /Browse available rooms in Bristol/i })).toBeVisible();
      await expectTopBack(/Back to branch/i);
      await capture("06-renter-browse");

      await page.getByRole("button", { name: /Adjust filters/i }).click();
      await expect(page.getByRole("heading", { name: /Set filters before matching/i })).toBeVisible();
      await expectTopBack(/Back to browse/i);
      await capture("07-renter-filters");

      await page.locator(".screen-flow-nav").getByRole("button", { name: /Apply filters/i }).click();
      await expect(page.getByRole("heading", { name: /Suggested rooms and roommates/i })).toBeVisible();
      await expectTopBack(/Back to filters/i);
      await capture("08-renter-suggestions");

      await page.locator(".suggestion-card").first().click();
      await expect(page.locator(".detail-hero-panel")).toBeVisible();
      await expectTopBack(/Back to suggestions/i);
      await capture("09-renter-match-detail");

      await page.getByRole("button", { name: /Back to suggestions/i }).first().click();
      await expect(page.getByRole("heading", { name: /Suggested rooms and roommates/i })).toBeVisible();
      await page.locator(".screen-flow-nav").getByRole("button", { name: /Open match feed/i }).click();

      await expect(page.locator(".feed-card-docked")).toBeVisible();
      await expectTopBack(/Back to suggestions/i);
      await capture("10-renter-match-feed");

      await page.getByRole("button", { name: /^Like$/i }).click();
      await expect(page.getByRole("heading", { name: /Send intro or quick questions/i })).toHaveCount(0);
      await page.getByRole("button", { name: /Back to suggestions/i }).click();
      await expect(page.getByRole("heading", { name: /Suggested rooms and roommates/i })).toBeVisible();
      await page.locator(".suggestion-card").first().click();
      await expect(page.getByRole("button", { name: /Send intro to unlock chat/i })).toBeDisabled();
      await expectTopBack(/Back to suggestions/i);
      await capture("11-renter-match-detail-liked");

      await page.getByRole("button", { name: /^Like$/i }).click();
      await page.locator(".detail-action-footer").getByRole("button", { name: /^Send intro$/i }).click();
      await expect(page.getByRole("heading", { name: /Send intro or quick questions/i })).toBeVisible();
      await expectTopBack(/Back to room detail/i);
      await capture("12-renter-send-intro");

      await page.locator(".send-intro-screen > .button-row").getByRole("button", { name: /^Send intro$/i }).click();
      await expect(page.locator(".chat-thread-body")).toBeVisible();
      await expectTopBack(/Back to chats/i);
      await capture("13-renter-chat-thread");

      await page.getByRole("button", { name: /Back to chats/i }).first().click();
      await expect(page.getByRole("heading", { name: /House group chats/i })).toBeVisible();
      await expectTopBack(/Back to interested houses/i);
      await capture("14-renter-group-chat");

      await page.locator(".bottom-nav").getByRole("button", { name: /^Interested$/i }).click();
      await expect(page.getByRole("heading", { name: /Saved, liked, and contacted houses/i })).toBeVisible();
      await expectTopBack(/Back to suggestions/i);
      await capture("15-renter-saved-list");

      await page.locator(".bottom-nav").getByRole("button", { name: /^Profile$/i }).click();
      await expect(page.getByRole("heading", { name: /Your renter profile/i })).toBeVisible();
      await expectTopBack(/Back to interested houses/i);
      await capture("16-renter-profile");

      await page.getByRole("button", { name: /Sign out/i }).click();
      await expect(page.getByRole("heading", { name: /Launch the profile/i })).toBeVisible();
    }

    async function runOwnerFlow() {
      await page.getByRole("button", { name: /Demo account/i }).click();
      await page.getByRole("button", { name: /Continue to verification/i }).click();
      await page.getByRole("button", { name: /Start questionnaire/i }).click();
      await advanceQuiz();
      await page.getByRole("button", { name: /Continue to branch/i }).click();

      await expect(page.getByRole("heading", { name: /Choose where the live experience branches/i })).toBeVisible();
      await page.getByRole("button", { name: /Start owner journey/i }).click();

      await expect(page.getByRole("heading", { name: /Create your listing and shortlist housemates/i })).toBeVisible();
      await expectTopBack(/Back to branch/i);
      await capture("16-owner-listing");

      await page.locator(".screen-flow-nav").getByRole("button", { name: /Continue to renter matches/i }).click();
      await expect(page.getByRole("heading", { name: /Suggested renters for your listing/i })).toBeVisible();
      await expectTopBack(/Back to listing/i);
      await capture("17-owner-suggestions");

      await page.locator(".owner-candidate-card").first().click();
      await expect(page.locator(".detail-action-footer").getByRole("button", { name: /^Send intro$/i })).toBeVisible();
      await expectTopBack(/Back to suggestions/i);
      await capture("18-owner-candidate-detail");

      await page.getByRole("button", { name: /Back to suggestions/i }).first().click();
      await expect(page.getByRole("heading", { name: /Suggested renters for your listing/i })).toBeVisible();
      await page.locator(".screen-flow-nav").getByRole("button", { name: /Open owner match feed/i }).click();

      await expect(page.locator(".feed-card-docked")).toBeVisible();
      await expectTopBack(/Back to suggestions/i);
      await capture("19-owner-match-feed");

      await page.getByRole("button", { name: /^Like$/i }).click();
      await expect(page.getByRole("heading", { name: /Send intro or quick questions/i })).toHaveCount(0);
      await page.getByRole("button", { name: /Back to suggestions/i }).click();
      await expect(page.getByRole("heading", { name: /Suggested renters for your listing/i })).toBeVisible();
      await page.locator(".owner-candidate-card").first().click();
      await expect(page.getByRole("button", { name: /Send intro to unlock chat/i })).toBeDisabled();
      await expectTopBack(/Back to suggestions/i);
      await capture("20-owner-candidate-detail-liked");

      await page.getByRole("button", { name: /^Like$/i }).click();
      await page.locator(".detail-action-footer").getByRole("button", { name: /^Send intro$/i }).click();
      await expect(page.getByRole("heading", { name: /Send intro or quick questions/i })).toBeVisible();
      await expectTopBack(/Back to renter detail/i);
      await capture("21-owner-send-intro");

      await page.locator(".send-intro-screen > .button-row").getByRole("button", { name: /^Send intro$/i }).click();
      await expect(page.locator(".chat-thread-body")).toBeVisible();
      await expectTopBack(/Back to chats/i);
      await capture("22-owner-chat-thread");

      await page.getByRole("button", { name: /Back to chats/i }).first().click();
      await expect(page.getByRole("heading", { name: /Renter conversations/i })).toBeVisible();
      await expectTopBack(/Back to shortlist/i);
      await capture("23-owner-group-chat");

      await page.locator(".bottom-nav").getByRole("button", { name: /^Saved$/i }).click({ timeout: 10_000 });
      await expect(page.getByRole("heading", { name: /Shortlisted and contacted renters/i })).toBeVisible();
      await expectTopBack(/Back to suggestions/i);
      await capture("24-owner-saved-list");

      await page.locator(".bottom-nav").getByRole("button", { name: /^Profile$/i }).click();
      await expect(page.getByRole("heading", { name: /Your host profile and room listing/i })).toBeVisible();
      await expectTopBack(/Back to shortlist/i);
      await capture("25-owner-profile");
    }

    try {
      await completeOnboarding();
      await runRenterFlow();
      await runOwnerFlow();
    } finally {
      fs.writeFileSync(path.join(outputDir, "audit-report.json"), JSON.stringify(entries, null, 2));
    }
  });
});
