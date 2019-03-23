const puppeteer = require('puppeteer');
const { allCharacters } = require('../../src/app/data.json');

const fs = require('fs');

if(!fs.existsSync(`src/assets/cards`)) fs.mkdirSync(`src/assets/cards`);

const html = fs.readFileSync(__dirname + '/compiled.html', 'utf-8');

const init = async () => {
  const browser = await puppeteer.launch();
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  function imagesHaveLoaded() { return Array.from(document.images).every((i) => i.complete); }
  await page.waitForFunction(imagesHaveLoaded, { timeout: 10000 });

  async function screenshotDOMElement(opts = {}) {
    const padding = 'padding' in opts ? opts.padding : 0;
    const path = 'path' in opts ? opts.path : null;
    const selector = opts.selector;

    if(!selector) throw Error('Please provide a selector.');

    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      if(!element) return null;

      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
    }, selector);

    if(!rect) throw Error(`Could not find element that matches selector: ${selector}.`);

    return await page.screenshot({
      path,
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    });
  }

  await Promise.all(
    allCharacters.map(char => {
      const fileName = `${char.picture}-${char.awakened ? 'a-' : ''}${char.cat}`;

      return screenshotDOMElement({
        path: `src/assets/cards/${fileName}.png`,
        selector: `[data-character="${fileName}"]`
      })
    })
  );
  
  await browser.close();
};

init();
