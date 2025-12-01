import { expect, test } from '@playwright/test'

test.describe('Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/PoemQuest/)
  })

  test('display search result', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Title:' }).click()
    await page.getByRole('textbox', { name: 'Title:' }).fill('Sonnet')
    await page.getByRole('combobox', { name: 'Author:' }).click()
    await page.getByRole('combobox', { name: 'Author:' }).fill('Shakespeare')
    await page.getByRole('spinbutton', { name: 'Poem Count:' }).click()
    await page.getByRole('spinbutton', { name: 'Poem Count:' }).fill('1')
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.locator('app-home')).toContainText('Sonnet')
  })

  test('display no results', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Author:' }).click()
    await page.getByRole('combobox', { name: 'Author:' }).fill('Invalid Author Name')
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.locator('app-home')).toContainText('No results loaded.')
  })

  test('display authors drop-down', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Author:' }).click()
    await page.locator('.mat-mdc-autocomplete-panel mat-option').nth(1).click()
    await expect(page.getByRole('combobox', { name: 'Author:' })).toBeTruthy()
  })
})
