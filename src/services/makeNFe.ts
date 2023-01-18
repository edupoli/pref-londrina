import * as puppeteer from 'puppeteer';
import { createWorker } from 'tesseract.js';

async function recognizeCaptcha(): Promise<string> {
  const worker = await createWorker({
    logger: (m) => console.log(m),
  });

  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const {
    data: { text },
  } = await worker.recognize('captcha.png');
  await worker.terminate();
  return text;
}

export async function create(cmc: string, uf: string, senha: any) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://iss.londrina.pr.gov.br/contador/login.php');
  await page.waitForSelector("td[align='center'] img");
  const element = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    const { x, y, width, height } = element!.getBoundingClientRect();
    return { x, y, width, height };
  }, "td[align='center'] img");
  await page.screenshot({
    path: 'captcha.png',
    clip: {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    },
  });

  const text = await recognizeCaptcha();

  const inputCMC = await page.$("input[name='crc']");
  await inputCMC?.type(cmc, { delay: 100 });
  await page.select('#estado', uf);
  const inputSenha = await page.$("input[name='senha']");
  await inputSenha?.type(senha, { delay: 100 });
  await page.waitForSelector("input[name='confirma']");
  const inputConfirma = await page.$("input[name='confirma']");
  console.log(text);
  await page.evaluate(
    (inputConfirma, value) => {
      inputConfirma!.value = value;
    },
    inputConfirma,
    text
  );
  const button = await page.$("button[name='btnOk']");
  await button?.click();
  await page.waitForNavigation();
}
