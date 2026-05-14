import { BasePage } from './base-page'

export class LabelsPage extends BasePage {
  constructor(page) {
    super(page, {
      basePath: 'labels',
      entityName: 'Label',
      listHeadingName: 'Labels',
      createHeadingName: 'Create Label',
      emptyTitle: 'No Labels yet.',
      emptyDescription: 'Do you want to add one?',
    })
  }

  async fillLabelForm({ name }) {
    await this.nameInput.fill(name)
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
