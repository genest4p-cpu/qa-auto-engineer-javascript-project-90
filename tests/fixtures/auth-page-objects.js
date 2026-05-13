import { expect, test as base } from './page-objects'
import { loginAsAnyUser } from '../helpers/auth'

export const test = base.extend({
  authenticatedSession: [
    async ({ page }, runFixture) => {
      await loginAsAnyUser(page)
      await runFixture()
    },
    { auto: true },
  ],
})

export { expect }