import { expect, test } from './fixtures/auth-page-objects'

const initialStatuses = [
  { name: 'Draft', slug: 'draft' },
  { name: 'To Review', slug: 'to_review' },
  { name: 'To Be Fixed', slug: 'to_be_fixed' },
  { name: 'To Publish', slug: 'to_publish' },
  { name: 'Published', slug: 'published' },
]

test.describe('статусы', () => {
  test('форма создания статуса отображается и сохраняет введенные данные', async ({
    page,
    statusesPage,
  }) => {
    const newStatus = {
      name: 'Ready for QA',
      slug: 'ready_for_qa',
    }

    await statusesPage.openCreateForm()
    await expect(statusesPage.createHeading).toBeVisible()
    await expect(statusesPage.nameInput).toBeVisible()
    await expect(statusesPage.slugInput).toBeVisible()
    await expect(statusesPage.saveButton).toBeDisabled()
    await statusesPage.fillStatusForm(newStatus)
    await expect(statusesPage.saveButton).toBeEnabled()
    await statusesPage.save()

    await expect(page).toHaveURL(statusesPage.detailsUrl)
    await expect(statusesPage.detailsHeading(newStatus.name)).toBeVisible()
    await expect(statusesPage.nameInput).toHaveValue(newStatus.name)
    await expect(statusesPage.slugInput).toHaveValue(newStatus.slug)
    await expect(statusesPage.createdAlert).toBeVisible()
  })

  test('список статусов отображается полностью и содержит основную информацию', async ({
    statusesPage,
  }) => {
    await statusesPage.openList()
    await expect(statusesPage.listHeading).toBeVisible()
    await expect(statusesPage.paginationSummary('1-5 of 5')).toBeVisible()

    for (const status of initialStatuses) {
      await expect(statusesPage.rowByName(status.name)).toContainText(status.name)
      await expect(statusesPage.rowByName(status.name)).toContainText(status.slug)
    }
  })

  test('форма редактирования статуса отображается и сохраняет изменения', async ({
    page,
    statusesPage,
  }) => {
    await statusesPage.openEditForm(1)
    await expect(statusesPage.detailsHeading('Draft')).toBeVisible()
    await expect(statusesPage.nameInput).toHaveValue('Draft')
    await expect(statusesPage.slugInput).toHaveValue('draft')

    await statusesPage.fillStatusForm({
      name: 'Ready',
      slug: 'ready',
    })
    await statusesPage.save()

    await expect(page).toHaveURL(statusesPage.listUrl)
    await expect(statusesPage.listHeading).toBeVisible()
    await expect(statusesPage.updatedAlert).toBeVisible()
  })

  test('можно удалить выбранные статусы', async ({ statusesPage }) => {
    await statusesPage.openList()
    await expect(statusesPage.paginationSummary('1-5 of 5')).toBeVisible()
    await statusesPage.selectStatusByName('Draft')
    await statusesPage.selectStatusByName('To Review')
    await expect(statusesPage.selectedItemsCount(2)).toBeVisible()
    await statusesPage.deleteSelectedStatuses()

    await expect(statusesPage.rowByName('Draft')).toHaveCount(0)
    await expect(statusesPage.rowByName('To Review')).toHaveCount(0)
    await expect(statusesPage.paginationSummary('1-3 of 3')).toBeVisible()
  })

  test('можно выделить все статусы и удалить их массово', async ({ statusesPage }) => {
    await statusesPage.openList()
    await statusesPage.selectAllStatuses()
    await expect(statusesPage.selectedItemsCount(5)).toBeVisible()
    await expect(statusesPage.selectAllCheckbox).toBeChecked()
    await statusesPage.deleteSelectedStatuses()

    await expect(statusesPage.emptyStateTitle).toBeVisible()
    await expect(statusesPage.emptyStateDescription).toBeVisible()
    await expect(statusesPage.rowsMatching(/draft|publish|review/i)).toHaveCount(0)
  })
})