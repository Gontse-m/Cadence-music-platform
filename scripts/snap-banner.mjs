import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:3000/banner-shot.html'

async function shoot(width, height, outPath) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.goto(`${URL}?h=${height}`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: outPath, type: 'png' })
  await browser.close()
  console.log(`wrote ${outPath} at ${width}x${height}`)
}

await shoot(1600, 400, 'branding/cadence-banner-4x1.png')
await shoot(1600, 533, 'branding/cadence-banner-3x1.png')
