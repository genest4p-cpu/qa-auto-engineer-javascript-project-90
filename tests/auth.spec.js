import { expect, test } from './fixtures/page-objects'
import { loginAsAnyUser, openLoginPage } from './helpers/auth'

test.describe('аутентификация и авторизация', () => {
  test('пользователь может войти в приложение с любыми данными', async ({
    page,
    dashboardPage,
    loginPage,
  }) => {
    await openLoginPage(page)

    await expect(page).toHaveURL(loginPage.loginUrl)
    await expect(loginPage.usernameInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.signInButton).toBeVisible()
    await loginPage.login('qa-user', 'any-password')
    await expect(page).toHaveURL(dashboardPage.dashboardUrl)
    await expect(dashboardPage.dashboardHeading).toBeVisible()

  })

  test('пользователь может выйти из приложения', async ({ page, dashboardPage, loginPage }) => {
    await loginAsAnyUser(page)

    await expect(page).toHaveURL(dashboardPage.dashboardUrl)
    await expect(dashboardPage.dashboardHeading).toBeVisible()
    await dashboardPage.logout()
    await expect(page).toHaveURL(loginPage.loginUrl)
    await expect(loginPage.usernameInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.signInButton).toBeVisible()
  })
})