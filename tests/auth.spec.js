import { expect, test } from '@playwright/test'
import { DashboardPage } from './page-objects/dashboard-page'
import { LoginPage } from './page-objects/login-page'

test.describe('аутентификация и авторизация', () => {
  test('пользователь может войти в приложение с любыми данными', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.open()
    await expect(page).toHaveURL(/#\/login$/)
    await expect(loginPage.usernameInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.signInButton).toBeVisible()
    await loginPage.login('qa-user', 'any-password')
    await expect(page).toHaveURL(/#\/$/)
    await expect(dashboardPage.dashboardHeading).toBeVisible()

  })

  test('пользователь может выйти из приложения', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.open()
    await loginPage.login('qa-user', 'any-password')
    await expect(page).toHaveURL(/#\/$/)
    await expect(dashboardPage.dashboardHeading).toBeVisible()
    await dashboardPage.logout()
    await expect(page).toHaveURL(/#\/login$/)
    await expect(loginPage.usernameInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.signInButton).toBeVisible()
  })
})