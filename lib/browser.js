import puppeteer from 'puppeteer';

let browser = null;

const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
  }
};

export {
  getBrowser,
  closeBrowser,
};
