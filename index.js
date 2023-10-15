import puppeteer from "puppeteer";
import fs from 'fs';

let browser = null;

export const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
  }
  return browser;
}

export const closeBrowser = async () => {
  if (browser) {
    await browser.close();
  }
}

const verificationsTodo = [
  {
    'user': 'Elliot Janvier',
    'file': 'attestation.pdf',
  },
  {
    'user': 'Alexis Faure',
    'file': 'attestation.pdf',
  },
  {
    'user': 'John Doe',
    'file': 'test.pdf',
  }
]

const parseData = (data) => {
  //remove empty lines
  const filteredData = data.filter(line => line !== '' && line !== 'Fichier');
  //clean lines
  const cleanedData = filteredData.map(line => line.trim());
  //remove first line
  cleanedData.shift();
  //remove duplicate lines
  const uniqueData = [...new Set(cleanedData)];
  return uniqueData;
}

const parseDateInString = (str) => {
  const dateRegex = /(\d{2})\/(\d{2})\/(\d{4})/;
  const matches = str.match(dateRegex);
  if (matches) {
    const [day, month, year] = matches.slice(1);
    return new Date(year, month - 1, day);
  }
  return null;
}

const fileIncludeName = (file, name) => {
  try {
    const fileContent = fs.readFileSync(file, 'utf-8');
    const infos = [];
    for (const line of fileContent.split('\n')) {
      if (line.startsWith('/givenName') || line.startsWith('/familyName')) {
        infos.push(line.split(' ')[1].replace('(', '').replace(')', ''));
      }
    }
    const full_name = infos.reverse().join(' ');
    return full_name === name.toUpperCase();
  } catch (e) {
    return false;
  }
}

const runIteration = async (file) => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto("https://idp.france-identite.gouv.fr/usager/valider-attest");
  await page.waitForTimeout(1000);
  const fileInput = await page.$('input[type=file]');
  await fileInput.uploadFile(file);
  await page.waitForTimeout(1000);
  const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'))
    return tds.map(td => td.innerText)
  });
  await page.close();
  const [name, validity] = parseData(data);
  return { name, validity };
}

const run = async () => {
  for (const todo of verificationsTodo) {
    const { name, validity } = await runIteration(todo.file);
    console.log(fileIncludeName(todo.file, todo.user));
    if (name !== todo.file) {
      console.log(`Error: ${todo.file} is not ${name}`);
    }
    if (validity.includes('Invalide')) {
      console.log(`Error: ${todo.file} for ${todo.user} is not valid`);
    } else if (validity.includes('valide')) {
      if (!fileIncludeName(todo.file, todo.user)) {
        console.log(`Error: ${todo.file} is not ${todo.user}`);
        continue;
      }
      const date = parseDateInString(validity);
      console.log(`Success: ${todo.file} for ${todo.user} is valid until ${date.toISOString().split('T')[0]}`);
    } else {
      console.log(`Error: ${todo.file} for ${todo.user} is unknown`);
    }
  }
  await closeBrowser();
}

run();