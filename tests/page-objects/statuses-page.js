import { BasePage } from './base-page'

export class StatusesPage extends BasePage {
  constructor(page) {
    super(page, {
      basePath: 'task_statuses',
      entityName: 'Task status',
      listHeadingName: 'Task statuses',
      createHeadingName: 'Create Task status',
      emptyTitle: 'No Task statuses yet.',
      emptyDescription: 'Do you want to add one?',
    })
    this.slugInput = page.getByRole('textbox', { name: 'Slug' })
  }

  async fillStatusForm({ name, slug }) {
    await this.nameInput.fill(name)
    await this.slugInput.fill(slug)
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
