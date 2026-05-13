const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const taskStatuses = ['Draft', 'To Review', 'To Be Fixed', 'To Publish', 'Published']

export class TasksPage {
  constructor(page) {
    this.page = page
    this.listUrl = /#\/tasks$/
    this.detailsUrl = /#\/tasks\/\d+$/
    this.createHeading = page.getByRole('heading', { name: 'Create Task' })
    this.listHeading = page.getByRole('heading', { name: 'Tasks' })
    this.createLink = page.getByRole('link', { name: 'Create' })
    this.saveButton = page.getByRole('button', { name: 'Save' })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })
    this.assigneeCombobox = page.getByRole('combobox', { name: /Assignee/ })
    this.titleInput = page.getByRole('textbox', { name: 'Title' })
    this.contentInput = page.getByRole('textbox', { name: 'Content' })
    this.statusCombobox = page.getByRole('combobox', { name: /Status/ })
    this.labelCombobox = page.getByRole('combobox', { name: /Label/ })
    this.createdAlert = page.getByRole('alert').filter({ hasText: 'Element created' })
    this.updatedAlert = page.getByRole('alert').filter({ hasText: 'Element updated' })
    this.deletedAlert = page.getByRole('alert').filter({ hasText: 'Element deleted' })
  }

  async openList() {
    await this.page.goto('/#/tasks')
  }

  async openCreateForm() {
    await this.page.goto('/#/tasks/create')
  }

  async openEditForm(id) {
    await this.page.goto(`/#/tasks/${id}`)
  }

  columnByStatus(statusName) {
    return this.page.getByRole('heading', { name: statusName, exact: true }).locator('xpath=..')
  }

  droppableByStatus(statusName) {
    return this.page
      .getByRole('heading', { name: statusName, exact: true })
      .locator('xpath=following-sibling::*[1]')
  }

  cardByTitle(title) {
    return this.page.getByRole('button', { name: new RegExp(`^${escapeRegex(title)}\\b`) })
  }

  detailsHeading(title) {
    return this.page.getByRole('heading', { name: `Task ${title}` })
  }

  statusHeading(statusName) {
    return this.page.getByRole('heading', { name: statusName })
  }

  cardInColumn(statusName, title) {
    return this.droppableByStatus(statusName).getByRole('button', {
      name: new RegExp(`^${escapeRegex(title)}\\b`),
    })
  }

  async selectComboboxOption(combobox, option) {
    await combobox.click()
    await this.page.getByRole('option', { name: option, exact: true }).click()
  }

  async fillTaskForm({ assignee, title, content, status, label }) {
    if (assignee) {
      await this.selectComboboxOption(this.assigneeCombobox, assignee)
    }

    if (title !== undefined) {
      await this.titleInput.fill(title)
    }

    if (content !== undefined) {
      await this.contentInput.fill(content)
    }

    if (status) {
      await this.selectComboboxOption(this.statusCombobox, status)
    }

    if (label) {
      await this.selectComboboxOption(this.labelCombobox, label)
    }
  }

  async save() {
    await this.saveButton.click()
  }

  async deleteTask() {
    await this.deleteButton.click()
  }

  async filterByAssignee(assignee) {
    await this.selectComboboxOption(this.assigneeCombobox, assignee)
  }

  async filterByStatus(status) {
    await this.selectComboboxOption(this.statusCombobox, status)
  }

  async filterByLabel(label) {
    await this.selectComboboxOption(this.labelCombobox, label)
  }

  async dragTaskToColumn(title, statusName) {
    const card = this.cardByTitle(title)
    let currentStatusIndex = -1

    for (let index = 0; index < taskStatuses.length; index += 1) {
      if ((await this.cardInColumn(taskStatuses[index], title).count()) > 0) {
        currentStatusIndex = index
        break
      }
    }

    const targetStatusIndex = taskStatuses.indexOf(statusName)

    if (currentStatusIndex === -1 || targetStatusIndex === -1) {
      throw new Error('Unable to resolve task column for drag and drop')
    }

    const direction = targetStatusIndex > currentStatusIndex ? 'ArrowRight' : 'ArrowLeft'
    const steps = Math.abs(targetStatusIndex - currentStatusIndex)

    await card.focus()
    await this.page.keyboard.press('Space')

    for (let step = 0; step < steps; step += 1) {
      await this.page.keyboard.press(direction)
    }

    await this.page.keyboard.press('Space')
  }
}