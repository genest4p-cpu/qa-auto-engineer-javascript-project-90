import { expect, test } from './fixtures/auth-page-objects'

const initialLabels = ['bug', 'feature', 'enhancement', 'task', 'critical']

test.describe('метки', () => {
  test('форма создания метки отображается и сохраняет введенные данные', async ({
    page,
    labelsPage,
  }) => {
    const newLabel = { name: 'qa-label' }

    await labelsPage.openCreateForm()

    await expect(labelsPage.createHeading).toBeVisible()
    await expect(labelsPage.nameInput).toBeVisible()
    await expect(labelsPage.saveButton).toBeDisabled()

    await labelsPage.fillLabelForm(newLabel)
    await expect(labelsPage.saveButton).toBeEnabled()

    await labelsPage.save()

    await expect(page).toHaveURL(labelsPage.detailsUrl)
    await expect(labelsPage.detailsHeading(newLabel.name)).toBeVisible()
    await expect(labelsPage.nameInput).toHaveValue(newLabel.name)
    await expect(labelsPage.createdAlert).toBeVisible()
  })

  test('список меток отображается полностью и содержит основную информацию', async ({
    labelsPage,
  }) => {
    await labelsPage.openList()

    await expect(labelsPage.listHeading).toBeVisible()
    await expect(labelsPage.paginationSummary('1-5 of 5')).toBeVisible()

    for (const label of initialLabels) {
      await expect(labelsPage.rowByName(label)).toContainText(label)
    }
  })

  test('форма редактирования метки отображается и сохраняет изменения', async ({
    page,
    labelsPage,
  }) => {
    await labelsPage.openEditForm(1)

    await expect(labelsPage.detailsHeading('bug')).toBeVisible()
    await expect(labelsPage.nameInput).toHaveValue('bug')

    await labelsPage.fillLabelForm({ name: 'bugfix' })
    await labelsPage.save()

    await expect(page).toHaveURL(labelsPage.listUrl)
    await expect(labelsPage.listHeading).toBeVisible()
    await expect(labelsPage.updatedAlert).toBeVisible()
  })

  test('можно удалить выбранные метки', async ({ labelsPage }) => {
    await labelsPage.openList()
    await expect(labelsPage.paginationSummary('1-5 of 5')).toBeVisible()
    await labelsPage.selectLabelByName('bug')
    await labelsPage.selectLabelByName('feature')

    await expect(labelsPage.selectedItemsCount(2)).toBeVisible()

    await labelsPage.deleteSelectedLabels()

    await expect(labelsPage.rowByName('bug')).toHaveCount(0)
    await expect(labelsPage.rowByName('feature')).toHaveCount(0)
    await expect(labelsPage.paginationSummary('1-3 of 3')).toBeVisible()
  })

  test('можно выделить все метки и удалить их массово', async ({ labelsPage }) => {
    await labelsPage.openList()
    await labelsPage.selectAllLabels()

    await expect(labelsPage.selectedItemsCount(5)).toBeVisible()
    await expect(labelsPage.selectAllCheckbox).toBeChecked()

    await labelsPage.deleteSelectedLabels()

    await expect(labelsPage.emptyStateTitle).toBeVisible()
    await expect(labelsPage.emptyStateDescription).toBeVisible()
    await expect(labelsPage.rowsMatching(/bug|feature|enhancement|task|critical/i)).toHaveCount(0)
  })
})