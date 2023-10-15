import fs from 'fs';
import { getBrowser, closeBrowser } from './browser.js';
import { parseData, parseDateInString } from './utils.js';

const VALID_DOCUMENT = 'Document valide';
const INVALID_DOCUMENT = 'Document invalide';
const UNKNOWN_DOCUMENT = 'Document inconnu';

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

const getFullNameInAttestation = (file) => {
  try {
    const fileContent = fs.readFileSync(file, 'utf-8');
    const infos = [];
    for (const line of fileContent.split('\n')) {
      if (line.startsWith('/givenName') || line.startsWith('/familyName')) {
        infos.push(line.split(' ')[1].replace('(', '').replace(')', ''));
      }
    }
    return infos.reverse().join(' ');
  } catch (e) {
    return null;
  }
}

const verifyFile = async (file) => {
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
  const [filename, validity] = parseData(data);
  const name = getFullNameInAttestation(file);
  return { filename, validity, name };
}

const verify = async (files) => {
  const filesResult = [];

  // process files
  for (const file of files) {
    let result = await verifyFile(file.file);
    result = { ...result, ...file};
    filesResult.push(result);
  }

  // close browser because we don't need it anymore
  await closeBrowser();

  // process results
  for (const r of filesResult) {
    if (!r.validity) {
      r.valid = null;
      continue;
    }
    if (r.validity.includes(INVALID_DOCUMENT)) {
      r.valid = false;
    } else if (r.validity.includes(VALID_DOCUMENT)) {
      const date = parseDateInString(r.validity);
      if (!date) {
        // if we can't parse the date, we don't know if the document is valid or not
        r.valid = null;
        continue;
      }
      r.validUntil = date;
      r.valid = true;
    } else {
      r.valid = null;
    }
  }
  return filesResult;
}

export {
  verify,
  fileIncludeName,
};

export default verify;
