import { expect, test } from '@playwright/test'
import { LoginPage } from './page-objects/login-page'
import { UsersPage } from './page-objects/users-page'

const initialUsers = [
  { email: 'john@google.com', firstName: 'John', lastName: 'Doe' },
  { email: 'jack@yahoo.com', firstName: 'Jack', lastName: 'Jons' },
  { email: 'jane@gmail.com', firstName: 'Jane', lastName: 'Smith' },
  { email: 'alice@hotmail.com', firstName: 'Alice', lastName: 'Johnson' },
  { email: 'peter@outlook.com', firstName: 'Peter', lastName: 'Brown' },
  { email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Wilson' },
  { email: 'michael@example.com', firstName: 'Michael', lastName: 'Davis' },
  { email: 'emily@example.com', firstName: 'Emily', lastName: 'Martinez' },
]

test.describe('пользователи', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.open()
    await loginPage.login('qa-user', 'any-password')
  })

  test('форма создания пользователя отображается и сохраняет введенные данные', async ({
    page,
  }) => {
    const usersPage = new UsersPage(page)
    const newUser = {
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
    }

    await usersPage.openCreateForm()

    await expect(page.getByRole('heading', { name: 'Create User' })).toBeVisible()
    await expect(usersPage.emailInput).toBeVisible()
    await expect(usersPage.firstNameInput).toBeVisible()
    await expect(usersPage.lastNameInput).toBeVisible()
    await expect(usersPage.saveButton).toBeDisabled()

    await usersPage.fillUserForm(newUser)
    await expect(usersPage.saveButton).toBeEnabled()

    await usersPage.save()

    await expect(page).toHaveURL(/#\/users\/\d+$/)
    await expect(page.getByRole('heading', { name: `User ${newUser.email}` })).toBeVisible()
    await expect(usersPage.emailInput).toHaveValue(newUser.email)
    await expect(usersPage.firstNameInput).toHaveValue(newUser.firstName)
    await expect(usersPage.lastNameInput).toHaveValue(newUser.lastName)
    await expect(usersPage.createdAlert).toBeVisible()
  })

  test('список пользователей отображается полностью и содержит основную информацию', async ({
    page,
  }) => {
    const usersPage = new UsersPage(page)

    await usersPage.openList()

    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
    await expect(page.getByText('1-8 of 8')).toBeVisible()

    for (const user of initialUsers) {
      await expect(usersPage.rowByEmail(user.email)).toContainText(user.email)
      await expect(usersPage.rowByEmail(user.email)).toContainText(user.firstName)
      await expect(usersPage.rowByEmail(user.email)).toContainText(user.lastName)
    }
  })

  test('форма редактирования пользователя отображается и сохраняет изменения', async ({
    page,
  }) => {
    const usersPage = new UsersPage(page)

    await usersPage.openEditForm(1)

    await expect(page.getByRole('heading', { name: 'User john@google.com' })).toBeVisible()
    await expect(usersPage.emailInput).toHaveValue('john@google.com')
    await expect(usersPage.firstNameInput).toHaveValue('John')
    await expect(usersPage.lastNameInput).toHaveValue('Doe')

    await usersPage.fillUserForm({
      email: 'john.updated@example.com',
      firstName: 'Johnny',
      lastName: 'Doe-Smith',
    })
    await usersPage.save()

    await expect(page).toHaveURL(/#\/users$/)
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
    await expect(usersPage.updatedAlert).toBeVisible()
  })

  test('редактирование пользователя валидирует формат электронной почты', async ({
    page,
  }) => {
    const usersPage = new UsersPage(page)

    await usersPage.openEditForm(1)
    await usersPage.fillUserForm({
      email: 'invalid-email',
      firstName: 'John',
      lastName: 'Doe',
    })

    await usersPage.forceSave()

    await expect(page).toHaveURL(/#\/users\/1$/)
    await expect(page.getByText('Incorrect email format')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'User john@google.com' })).toBeVisible()
  })

  test('можно удалить выбранных пользователей', async ({ page }) => {
    const usersPage = new UsersPage(page)

    await usersPage.openList()
    await expect(page.getByText('1-8 of 8')).toBeVisible()
    await usersPage.selectUserByEmail('john@google.com')
    await usersPage.selectUserByEmail('jack@yahoo.com')

    await expect(page.getByText('2 items selected')).toBeVisible()

    await usersPage.deleteSelectedUsers()

    await expect(usersPage.rowByEmail('john@google.com')).toHaveCount(0)
    await expect(usersPage.rowByEmail('jack@yahoo.com')).toHaveCount(0)
    await expect(page.getByText('1-6 of 6')).toBeVisible()
  })

  test('можно выделить всех пользователей и удалить их массово', async ({ page }) => {
    const usersPage = new UsersPage(page)

    await usersPage.openList()
    await usersPage.selectAllUsers()

    await expect(page.getByText('8 items selected')).toBeVisible()
    await expect(usersPage.selectAllCheckbox).toBeChecked()

    await usersPage.deleteSelectedUsers()

    await expect(page.getByText('No Users yet.')).toBeVisible()
    await expect(page.getByText('Do you want to add one?')).toBeVisible()
    await expect(page.getByRole('row', { name: /@/ })).toHaveCount(0)
  })
})