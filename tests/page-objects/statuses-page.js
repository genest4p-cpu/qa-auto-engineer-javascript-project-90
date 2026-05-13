export class StatusesPage {
  constructor(page) {
    this.page = page
    this.listUrl = /#\/task_statuses$/
    this.detailsUrl = /#\/task_statuses\/\d+$/
    this.createHeading = page.getByRole('heading', { name: 'Create Task status' })
    this.listHeading = page.getByRole('heading', { name: 'Task statuses' })
    this.createLink = page.getByRole('link', { name: 'Create' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.bulkDeleteButton = page.getByRole('button', { name: 'Delete' })
    this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
    this.nameInput = page.getByRole('textbox', { name: 'Name' })
    this.slugInput = page.getByRole('textbox', { name: 'Slug' })
    this.emptyStateTitle = page.getByText('No Task statuses yet.')
    this.emptyStateDescription = page.getByText('Do you want to add one?')
    this.createdAlert = page.getByRole('alert').filter({ hasText: 'Element created' })
    this.updatedAlert = page.getByRole('alert').filter({ hasText: 'Element updated' })
  }

  async openList() {
    await this.page.goto('/#/task_statuses')
  }

  async openCreateForm() {
    await this.page.goto('/#/task_statuses/create')
  }

  async openEditForm(id) {
    await this.page.goto(`/#/task_statuses/${id}`)
  }

  rowByName(name) {
    return this.page.getByRole('row', { name: new RegExp(name) })
  }

  detailsHeading(name) {
    return this.page.getByRole('heading', { name: `Task status ${name}` })
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

  checkboxByName(name) {
    return this.rowByName(name).locator('input[type="checkbox"]')
  }

  async fillStatusForm({ name, slug }) {
    await this.nameInput.fill(name)
    await this.slugInput.fill(slug)
  }

  async save() {
    await this.saveButton.click()
  }

  async selectStatusByName(name) {
    await this.checkboxByName(name).check()
  }

  async selectAllStatuses() {
    await this.selectAllCheckbox.check()
  }

  async deleteSelectedStatuses() {
    await this.bulkDeleteButton.click()
  }
}