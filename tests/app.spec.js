import { expect, test } from '@playwright/test'

test('приложение успешно отображается', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/#\/login$/)
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
})