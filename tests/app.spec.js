import { expect, test } from './fixtures/page-objects'
import { openLoginPage } from './helpers/auth'

test('приложение успешно отображается', async ({ page, loginPage }) => {
  await openLoginPage(page)

  await expect(page).toHaveURL(loginPage.loginUrl)
  await expect(loginPage.usernameInput).toBeVisible()
  await expect(loginPage.passwordInput).toBeVisible()
  await expect(loginPage.signInButton).toBeVisible()
})