import { expect, test } from '@playwright/test'

test.describe('Details', () => {
  test('has poem', async ({ page }) => {
    await page.goto('/details/William%20Shakespeare/Sonnet%201:%20From%20fairest%20creatures%20we%20desire%20increase')
    await expect(page.locator('h2')).toContainText('Sonnet')
  })
})
