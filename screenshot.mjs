import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })

const routes = [
  { path: '/',              name: '1-welcome',    wait: 'Empezar gratis' },
  { path: '/register',     name: '2-register',   wait: 'Creá tu cuenta' },
  { path: '/confirm-email',name: '3-confirm',    wait: 'Confirmá tu email' },
  { path: '/validation',   name: '4-validation', wait: 'Validación académica' },
  { path: '/link-riot',    name: '5-link-riot',  wait: 'Vinculá tu cuenta' },
  { path: '/success',      name: '6-success',    wait: 'Listo para competir' },
]

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()

for (const { path, name, wait } of routes) {
  await page.goto(`http://localhost:5173${path}`)
  await page.waitForSelector(`text=${wait}`, { timeout: 10000 })
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  console.log(`✓ ${name}`)
}

const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
if (errors.length) console.error('Console errors:', errors)
else console.log('No console errors')

await browser.close()
