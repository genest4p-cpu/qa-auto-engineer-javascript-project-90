export class UsersPage {
  constructor(page) {
    this.page = page
    this.createLink = page.getByRole('link', { name: 'Create' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.bulkDeleteButton = page.getByRole('button', { name: 'Delete' })
    this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
    this.emailInput = page.getByRole('textbox', { name: 'Email' })
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' })
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' })
    this.createdAlert = page.getByRole('alert').filter({ hasText: 'Element created' })
    this.updatedAlert = page.getByRole('alert').filter({ hasText: 'Element updated' })
  }

  async openList() {
    await this.page.goto('/#/users')
  }

  async openCreateForm() {
    await this.page.goto('/#/users/create')
  }

  async openEditForm(id) {
    await this.page.goto(`/#/users/${id}`)
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

  async save() {
    await this.saveButton.click()
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