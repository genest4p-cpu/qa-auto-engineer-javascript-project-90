import { expect, test as base } from '@playwright/test'
import { DashboardPage } from '../page-objects/dashboard-page'
import { LabelsPage } from '../page-objects/labels-page'
import { LoginPage } from '../page-objects/login-page'
import { StatusesPage } from '../page-objects/statuses-page'
import { TasksPage } from '../page-objects/tasks-page'
import { UsersPage } from '../page-objects/users-page'

export const test = base.extend({
  loginPage: async ({ page }, runFixture) => {
    await runFixture(new LoginPage(page))
  },
  dashboardPage: async ({ page }, runFixture) => {
    await runFixture(new DashboardPage(page))
  },
  usersPage: async ({ page }, runFixture) => {
    await runFixture(new UsersPage(page))
  },
  statusesPage: async ({ page }, runFixture) => {
    await runFixture(new StatusesPage(page))
  },
  labelsPage: async ({ page }, runFixture) => {
    await runFixture(new LabelsPage(page))
  },
  tasksPage: async ({ page }, runFixture) => {
    await runFixture(new TasksPage(page))
  },
})

export { expect }