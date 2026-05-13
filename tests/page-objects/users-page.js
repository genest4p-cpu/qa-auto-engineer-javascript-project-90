export class UsersPage {
  constructor(page) {
    this.page = page
    this.listUrl = /#\/users$/
    this.detailsUrl = /#\/users\/\d+$/
    this.createHeading = page.getByRole('heading', { name: 'Create User' })
    this.listHeading = page.getByRole('heading', { name: 'Users' })
    this.createLink = page.getByRole('link', { name: 'Create' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.bulkDeleteButton = page.getByRole('button', { name: 'Delete' })
    this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
    this.emailInput = page.getByRole('textbox', { name: 'Email' })
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' })
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' })
    this.emptyStateTitle = page.getByText('No Users yet.')
    this.emptyStateDescription = page.getByText('Do you want to add one?')
    this.invalidEmailError = page.getByText('Incorrect email format')
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

  detailsHeading(email) {
    return this.page.getByRole('heading', { name: `User ${email}` })
  }

  paginationSummary(summary) {
    return this.page.getByText(summary)
  }

  selectedItemsCount(count) {
    return this.page.getByText(`${count} items selected`)
  }

  rowsMatching(pattern) {
    return this.page.getByRole('row', { name: pattern })
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