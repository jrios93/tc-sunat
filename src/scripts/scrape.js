import puppeteer from 'puppeteer'
import fs from 'fs/promises'
;(async function handleDynamicWebPage() {
  const URL = 'https://e-consulta.sunat.gob.pe/cl-at-ittipcam/tcS01Alias'
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
  })
  const page = await browser.newPage()
  await page.goto(URL, { waitUntil: 'networkidle2' })
  await page.waitForSelector('.calendar-day')
  const result = await page.evaluate(() => {
    const calendar = document.querySelectorAll('.calendar-day')
    const data = [...calendar].map(day => {
      const dateElement = day.querySelector('.date')
      const buysElement = day.querySelector('.normal-all-day')
      const sellElement = day.querySelector('.pap-all-day')
      const date = dateElement ? dateElement.innerText : null
      const buys = buysElement ? buysElement.innerText : null
      const sell = sellElement ? sellElement.innerText : null
      return {
        date,
        buys,
        sell,
      }
    })
    return data
  })
  
  console.log(result)
  await fs.writeFile('data/tc.json', JSON.stringify(result, null, 2))

  await browser.close()
})()
