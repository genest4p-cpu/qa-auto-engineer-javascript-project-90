import { expect, test } from './fixtures/auth-page-objects'

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
  test('форма создания пользователя отображается и сохраняет введенные данные', async ({
    page,
    usersPage,
  }) => {
    const newUser = {
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
    }

    await usersPage.openCreateForm()
    
    await expect(usersPage.createHeading).toBeVisible()
    await expect(usersPage.emailInput).toBeVisible()
    await expect(usersPage.firstNameInput).toBeVisible()
    await expect(usersPage.lastNameInput).toBeVisible()
    await expect(usersPage.saveButton).toBeDisabled()
    await usersPage.fillUserForm(newUser)
    await expect(usersPage.saveButton).toBeEnabled()
    await usersPage.save()

    await expect(page).toHaveURL(usersPage.detailsUrl)
    await expect(usersPage.detailsHeading(newUser.email)).toBeVisible()
    await expect(usersPage.emailInput).toHaveValue(newUser.email)
    await expect(usersPage.firstNameInput).toHaveValue(newUser.firstName)
    await expect(usersPage.lastNameInput).toHaveValue(newUser.lastName)
    await expect(usersPage.createdAlert).toBeVisible()
  })

  test('список пользователей отображается полностью и содержит основную информацию', async ({
    usersPage,
  }) => {
    await usersPage.openList()

    await expect(usersPage.listHeading).toBeVisible()
    await expect(usersPage.paginationSummary('1-8 of 8')).toBeVisible()

    for (const user of initialUsers) {
      await expect(usersPage.rowByEmail(user.email)).toContainText(user.email)
      await expect(usersPage.rowByEmail(user.email)).toContainText(user.firstName)
      await expect(usersPage.rowByEmail(user.email)).toContainText(user.lastName)
    }
  })

  test('форма редактирования пользователя отображается и сохраняет изменения', async ({
    page,
    usersPage,
  }) => {
    await usersPage.openEditForm(1)

    await expect(usersPage.detailsHeading('john@google.com')).toBeVisible()
    await expect(usersPage.emailInput).toHaveValue('john@google.com')
    await expect(usersPage.firstNameInput).toHaveValue('John')
    await expect(usersPage.lastNameInput).toHaveValue('Doe')

    await usersPage.fillUserForm({
      email: 'john.updated@example.com',
      firstName: 'Johnny',
      lastName: 'Doe-Smith',
    })
    await usersPage.save()

    await expect(page).toHaveURL(usersPage.listUrl)
    await expect(usersPage.listHeading).toBeVisible()
    await expect(usersPage.updatedAlert).toBeVisible()
  })

  test('редактирование пользователя валидирует формат электронной почты', async ({
    page,
    usersPage,
  }) => {
    await usersPage.openEditForm(1)
    await usersPage.fillUserForm({
      email: 'invalid-email',
      firstName: 'John',
      lastName: 'Doe',
    })

    await usersPage.forceSave()

    await expect(page).toHaveURL(/#\/users\/1$/)
    await expect(usersPage.invalidEmailError).toBeVisible()
    await expect(usersPage.detailsHeading('john@google.com')).toBeVisible()
  })

  test('можно удалить выбранных пользователей', async ({ usersPage }) => {
    await usersPage.openList()

    await expect(usersPage.paginationSummary('1-8 of 8')).toBeVisible()
    await usersPage.selectUserByEmail('john@google.com')
    await usersPage.selectUserByEmail('jack@yahoo.com')
    await expect(usersPage.selectedItemsCount(2)).toBeVisible()
    await usersPage.deleteSelectedUsers()

    await expect(usersPage.rowByEmail('john@google.com')).toHaveCount(0)
    await expect(usersPage.rowByEmail('jack@yahoo.com')).toHaveCount(0)
    await expect(usersPage.paginationSummary('1-6 of 6')).toBeVisible()
  })

  test('можно выделить всех пользователей и удалить их массово', async ({ usersPage }) => {
    await usersPage.openList()
    await usersPage.selectAllUsers()

    await expect(usersPage.selectedItemsCount(8)).toBeVisible()
    await expect(usersPage.selectAllCheckbox).toBeChecked()
    await usersPage.deleteSelectedUsers()

    await expect(usersPage.emptyStateTitle).toBeVisible()
    await expect(usersPage.emptyStateDescription).toBeVisible()
    await expect(usersPage.rowsMatching(/@/)).toHaveCount(0)
  })
})