const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const VIDEO_DIR = path.join(__dirname, "..", "videos");
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR);
}

const runDemo = async ({ url, steps }) => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 15000 });
    console.log("Waiting for the page to load...");
    console.log(JSON.stringify(steps, null, 2));
    for (const step of steps) {
      console.log(`➡️ Performing: ${step.action} on ${step.selector}`);
      try {
        await page.waitForSelector(step.selector, { timeout: 5000 });

        if (step.action === "click") {
          await page.click(step.selector);
        } else if (step.action === "type") {
          await page.fill(step.selector, step.value);
        } else if (step.action === "wait") {
          await page.waitForSelector(step.selector, { timeout: 10000 });
        } else if (step.action === "press") {
          await page.press(step.selector, step.value);
        }
        await page.waitForTimeout(500); // short delay between actions
      } catch (err) {
        console.warn(
          `⚠️ Failed step: ${JSON.stringify(step)} — ${err.message}`
        );
      }
    }

    await page.waitForTimeout(3000);
    const tempVideoPath = await page.video().path();
    await browser.close();

    return tempVideoPath;
  } catch (err) {
    await browser.close();
    console.error("❌ Error during Playwright demo:", err.message);
    throw err;
  }
};

module.exports = { runDemo };
