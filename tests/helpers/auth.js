import { LoginPage } from '../page-objects/login-page'

export const defaultCredentials = {
  username: 'qa-user',
  password: 'any-password',
}

export async function openLoginPage(page) {
  const loginPage = new LoginPage(page)

  await loginPage.open()

  return loginPage
}

export async function loginAsAnyUser(page, credentials = defaultCredentials) {
  const loginPage = await openLoginPage(page)

  await loginPage.login(credentials.username, credentials.password)

  return loginPage
}