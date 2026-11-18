import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}),
})
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 } })
  page.setDefaultTimeout(60_000)
  page.setDefaultNavigationTimeout(60_000)
  await page.route('https://api.themoviedb.org/**', route => route.fulfill({ json: { results: [] } }))
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5173'
  await page.goto(`${baseUrl}/?force=1`)
  await page.getByRole('heading', { name: 'Your services. One place.' }).waitFor()
  const next = page.getByRole('button', { name: 'Continue', exact: true })
  assert.equal(await next.isDisabled(), true)
  const choices = page.getByRole('checkbox')
  const serviceCount = await choices.count()
  assert.ok(serviceCount > 0)
  const netflix = page.getByRole('checkbox', { name: 'Netflix', exact: true })
  await netflix.focus()
  await page.keyboard.press('Space')
  assert.equal(await netflix.isChecked(), true)
  assert.equal(await next.isEnabled(), true)
  await page.locator('.picker-card').filter({ has: page.getByRole('checkbox', { name: 'Prime Video', exact: true }) }).click()
  await page.getByRole('button', { name: 'Review selection' }).click()
  await page.getByRole('button', { name: 'Move Prime Video earlier' }).click()
  assert.deepEqual(await page.locator('.selected-item > span').allTextContents(), ['Prime Video', 'Netflix'])
  await page.getByRole('button', { name: 'Remove Netflix', exact: true }).click()
  assert.equal(await netflix.isChecked(), false)
  await page.getByRole('button', { name: 'Close selected services' }).click()
  await page.reload()
  assert.equal(await page.getByRole('checkbox', { name: 'Prime Video', exact: true }).isChecked(), true)

  await page.getByRole('button', { name: 'Tracking', exact: true }).click()
  await page.getByRole('searchbox', { name: 'Search services' }).fill('Netflix')
  await page.getByRole('heading', { name: 'No services found' }).waitFor()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  assert.equal(await choices.count(), serviceCount)

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `No horizontal overflow at ${width}px`)
    const footer = await next.boundingBox()
    assert.ok(footer.y >= 0 && footer.y + footer.height <= 844, 'Continue stays visible')
    await page.getByRole('button', { name: 'Review selection' }).click()
    const reorder = await page.locator('.selection-panel').boundingBox()
    assert.ok(reorder.x >= 0 && reorder.x + reorder.width <= width, 'Selection panel fits mobile')
    await page.getByRole('button', { name: 'Close selected services' }).click()
  }
  await page.getByRole('searchbox', { name: 'Search services' }).fill('Netflix')
  await page.getByRole('checkbox', { name: 'Netflix', exact: true }).waitFor()
  await page.getByRole('searchbox', { name: 'Search services' }).fill('')
  await next.click()
  await page.waitForURL('**/home')
  assert.deepEqual(errors, [])
  console.log('Service picker: keyboard selection, reorder, persistence, filters, mobile layout, and continuation passed')
} finally {
  await browser.close()
}
