import { expect, test } from './fixtures/auth-page-objects'

test.describe('задачи', () => {
  test('форма создания задачи отображается и сохраняет введенные данные', async ({ page, tasksPage }) => {
    const newTask = {
      assignee: 'john@google.com',
      title: 'QA Task',
      content: 'QA task content',
      status: 'Draft',
    }

    await tasksPage.openCreateForm()

    await expect(tasksPage.createHeading).toBeVisible()
    await expect(tasksPage.assigneeCombobox).toBeVisible()
    await expect(tasksPage.titleInput).toBeVisible()
    await expect(tasksPage.contentInput).toBeVisible()
    await expect(tasksPage.statusCombobox).toBeVisible()
    await expect(tasksPage.labelCombobox).toBeVisible()
    await expect(tasksPage.saveButton).toBeDisabled()

    await tasksPage.fillTaskForm(newTask)
    await expect(tasksPage.saveButton).toBeEnabled()

    await tasksPage.save()

    await expect(page).toHaveURL(tasksPage.detailsUrl)
    await expect(tasksPage.detailsHeading(newTask.title)).toBeVisible()
    await expect(tasksPage.assigneeCombobox).toContainText(newTask.assignee)
    await expect(tasksPage.titleInput).toHaveValue(newTask.title)
    await expect(tasksPage.contentInput).toHaveValue(newTask.content)
    await expect(tasksPage.statusCombobox).toContainText(newTask.status)
    await expect(tasksPage.createdAlert).toBeVisible()
  })

  test('канбан-доска отображает задачи по статусам', async ({ tasksPage }) => {
    await tasksPage.openList()

    await expect(tasksPage.listHeading).toBeVisible()
    await expect(tasksPage.statusHeading('Draft')).toBeVisible()
    await expect(tasksPage.statusHeading('To Review')).toBeVisible()
    await expect(tasksPage.statusHeading('To Be Fixed')).toBeVisible()
    await expect(tasksPage.statusHeading('To Publish')).toBeVisible()
    await expect(tasksPage.statusHeading('Published')).toBeVisible()
    await expect(tasksPage.cardInColumn('Draft', 'Task 11')).toBeVisible()
    await expect(tasksPage.cardInColumn('To Review', 'Task 2')).toBeVisible()
    await expect(tasksPage.cardInColumn('To Be Fixed', 'Task 1')).toBeVisible()
    await expect(tasksPage.cardInColumn('To Publish', 'Task 3')).toBeVisible()
    await expect(tasksPage.cardInColumn('Published', 'Task 4')).toBeVisible()
  })

  test('форма редактирования задачи отображается и сохраняет изменения', async ({ page, tasksPage }) => {
    await tasksPage.openEditForm(1)

    await expect(tasksPage.detailsHeading('Task 1')).toBeVisible()
    await expect(tasksPage.titleInput).toHaveValue('Task 1')
    await expect(tasksPage.contentInput).toHaveValue('Description of task 1')
    await expect(tasksPage.statusCombobox).toContainText('To Be Fixed')

    await tasksPage.fillTaskForm({
      title: 'Task 1 Updated',
      content: 'Updated description of task 1',
    })
    await tasksPage.save()

    await expect(page).toHaveURL(tasksPage.listUrl)
    await expect(tasksPage.listHeading).toBeVisible()
    await expect(tasksPage.updatedAlert).toBeVisible()
    await expect(tasksPage.cardByTitle('Task 1 Updated')).toBeVisible()
  })

  test('можно удалить задачу', async ({ page, tasksPage }) => {
    await tasksPage.openEditForm(1)

    await expect(tasksPage.detailsHeading('Task 1')).toBeVisible()

    await tasksPage.deleteTask()

    await expect(page).toHaveURL(tasksPage.listUrl)
    await expect(tasksPage.deletedAlert).toBeVisible()

    await tasksPage.openList()
    await expect(tasksPage.cardByTitle('Task 1')).toHaveCount(0)
  })

  test('можно фильтровать задачи по исполнителю, статусу и метке', async ({ tasksPage }) => {
    await tasksPage.openList()
    await tasksPage.filterByAssignee('john@google.com')
    await tasksPage.filterByStatus('Draft')
    await tasksPage.filterByLabel('enhancement')

    await expect(tasksPage.cardInColumn('Draft', 'Task 11')).toBeVisible()
    await expect(tasksPage.cardByTitle('Task 5')).toHaveCount(0)
    await expect(tasksPage.cardByTitle('Task 2')).toHaveCount(0)
    await expect(tasksPage.cardByTitle('Task 6')).toHaveCount(0)
  })

  test('можно перемещать задачу между колонками канбан-доски', async ({ tasksPage }) => {
    await tasksPage.openList()
    await expect(tasksPage.cardInColumn('Draft', 'Task 11')).toBeVisible()

    await tasksPage.dragTaskToColumn('Task 11', 'To Review')

    await expect(tasksPage.cardInColumn('Draft', 'Task 11')).toHaveCount(0)
    await expect(tasksPage.cardInColumn('To Review', 'Task 11')).toBeVisible()

    await tasksPage.openEditForm(11)
    await expect(tasksPage.statusCombobox).toContainText('To Review')
  })
})