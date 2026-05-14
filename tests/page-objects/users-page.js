import { BasePage } from './base-page'

export class UsersPage extends BasePage {
  constructor(page) {
    super(page, {
      basePath: 'users',
      entityName: 'User',
      listHeadingName: 'Users',
      createHeadingName: 'Create User',
      emptyTitle: 'No Users yet.',
      emptyDescription: 'Do you want to add one?',
    })
    this.emailInput = page.getByRole('textbox', { name: 'Email' })
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' })
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' })
    this.invalidEmailError = page.getByText('Incorrect email format')
  }

  rowByEmail(email) {
    return this.page.getByRole('row', { name: new RegExp(email) })
  }

  checkboxByEmail(email) {
    return this.rowByEmail(email).locator('input[type="checkbox"]')
  }

  async fillUserForm({ email, firstName, lastName }) {
    await this.emailInput.fill(email)
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
  }

  async forceSave() {
    await this.saveButton.click({ force: true })
  }

  async selectUserByEmail(email) {
    await this.checkboxByEmail(email).check()
  }

  async selectAllUsers() {
    await this.selectAllCheckbox.check()
  }

  async deleteSelectedUsers() {
    await this.bulkDeleteButton.click()
  }
}
