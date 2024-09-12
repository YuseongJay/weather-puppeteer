import puppeteer from "puppeteer"
import sharp from "sharp"

const waitForTimeout = (milliseconds) =>
  new Promise((r) => setTimeout(r, milliseconds))

;(async () => {
  const browser = await puppeteer.launch({ timeout: 100000 })
  const context = browser.defaultBrowserContext()
  await context.overridePermissions("https://www.weather.go.kr", [
    "geolocation",
  ])

  const page = await browser.newPage()

  const iPhone13 = puppeteer.devices["iPhone 13"]
  const width = iPhone13.viewport.width
  const height = iPhone13.viewport.height

  await page.emulate(iPhone13)
  await page.setViewport({ width, height })
  await page.setGeolocation({
    latitude: 37.546549,
    longitude: 127.048458,
  })

  page.setDefaultNavigationTimeout(100000)
  await page.goto("https://www.weather.go.kr/w/image/vshrt/rain.do", {
    waitUntil: "networkidle0",
  })
  await page.reload()

  await page.click("button.ol-zoom-in", { delay: 500 })
  await page.click("button.ol-zoom-in", { delay: 500 })
  await page.click("button.ol-zoom-in", { delay: 500 })
  await page.click("button.ol-zoom-in", { delay: 500 })
  await page.click("button.ol-zoom-in", { delay: 500 })
  await page.click("button.ol-zoom-in", { delay: 500 })
  await waitForTimeout(1000)

  await page.click("button.start-btn")
  await waitForTimeout(10)

  const [p1] = await Promise.all([
    page.screenshot({ clip: { x: 0, y: 0, width, height } }),
    waitForTimeout(500),
  ])
  const [p2] = await Promise.all([
    page.screenshot({ clip: { x: 0, y: 0, width, height } }),
    waitForTimeout(500),
  ])
  const [p3] = await Promise.all([
    page.screenshot({ clip: { x: 0, y: 0, width, height } }),
    waitForTimeout(500),
  ])
  const [p4] = await Promise.all([
    page.screenshot({ clip: { x: 0, y: 0, width, height } }),
    waitForTimeout(500),
  ])
  const [p5] = await Promise.all([
    page.screenshot({ clip: { x: 0, y: 0, width, height } }),
    waitForTimeout(500),
  ])
  const [p6] = await Promise.all([
    page.screenshot({ clip: { x: 0, y: 0, width, height } }),
    waitForTimeout(500),
  ])
  const [p7] = await Promise.all([
    page.screenshot({ clip: { x: 0, y: 0, width, height } }),
    waitForTimeout(500),
  ])

  await sharp("base.gif", { pages: -1 })
    .composite([
      { input: p1, top: height * 0, left: 0 },
      { input: p2, top: height * 1, left: 0 },
      { input: p3, top: height * 2, left: 0 },
      { input: p4, top: height * 3, left: 0 },
      { input: p5, top: height * 4, left: 0 },
      { input: p6, top: height * 5, left: 0 },
      { input: p7, top: height * 6, left: 0 },
    ])
    .gif()
    .toFile("weather.gif")

  await browser.close()
})()
