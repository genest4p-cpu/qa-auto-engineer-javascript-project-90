export class LabelsPage {
  constructor(page) {
    this.page = page
    this.listUrl = /#\/labels$/
    this.detailsUrl = /#\/labels\/\d+$/
    this.createHeading = page.getByRole('heading', { name: 'Create Label' })
    this.listHeading = page.getByRole('heading', { name: 'Labels' })
    this.createLink = page.getByRole('link', { name: 'Create' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.bulkDeleteButton = page.getByRole('button', { name: 'Delete' })
    this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
    this.nameInput = page.getByRole('textbox', { name: 'Name' })
    this.emptyStateTitle = page.getByText('No Labels yet.')
    this.emptyStateDescription = page.getByText('Do you want to add one?')
    this.createdAlert = page.getByRole('alert').filter({ hasText: 'Element created' })
    this.updatedAlert = page.getByRole('alert').filter({ hasText: 'Element updated' })
  }

  async openList() {
    await this.page.goto('/#/labels')
  }

  async openCreateForm() {
    await this.page.goto('/#/labels/create')
  }

  async openEditForm(id) {
    await this.page.goto(`/#/labels/${id}`)
  }

  rowByName(name) {
    return this.page.getByRole('row', { name: new RegExp(name) })
  }

  detailsHeading(name) {
    return this.page.getByRole('heading', { name: `Label ${name}` })
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

  async fillLabelForm({ name }) {
    await this.nameInput.fill(name)
  }

  async save() {
    await this.saveButton.click()
  }

  async selectLabelByName(name) {
    await this.checkboxByName(name).check()
  }

  async selectAllLabels() {
    await this.selectAllCheckbox.check()
  }

  async deleteSelectedLabels() {
    await this.bulkDeleteButton.click()
  }
}