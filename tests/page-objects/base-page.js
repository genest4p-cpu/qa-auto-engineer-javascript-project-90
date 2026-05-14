export class BasePage {
  constructor(page, { basePath, entityName, listHeadingName, createHeadingName, emptyTitle, emptyDescription }) {
    this.page = page
    this.basePath = basePath
    this.listUrl = new RegExp(`#\\/${basePath}$`)
    this.detailsUrl = new RegExp(`#\\/${basePath}\\/\\d+$`)
    this.createHeading = page.getByRole('heading', { name: createHeadingName })
    this.listHeading = page.getByRole('heading', { name: listHeadingName })
    this.createLink = page.getByRole('link', { name: 'Create' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.bulkDeleteButton = page.getByRole('button', { name: 'Delete' })
    this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
    this.nameInput = page.getByRole('textbox', { name: 'Name' })
    this.emptyStateTitle = page.getByText(emptyTitle)
    this.emptyStateDescription = page.getByText(emptyDescription)
    this.createdAlert = page.getByRole('alert').filter({ hasText: 'Element created' })
    this.updatedAlert = page.getByRole('alert').filter({ hasText: 'Element updated' })
    this.entityName = entityName
  }

  async openList() {
    await this.page.goto(`/#/${this.basePath}`)
  }

  async openCreateForm() {
    await this.page.goto(`/#/${this.basePath}/create`)
  }

  async openEditForm(id) {
    await this.page.goto(`/#/${this.basePath}/${id}`)
  }

  rowByName(name) {
    return this.page.getByRole('row', { name: new RegExp(name) })
  }

  detailsHeading(name) {
    return this.page.getByRole('heading', { name: `${this.entityName} ${name}` })
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

  async save() {
    await this.saveButton.click()
  }
}
