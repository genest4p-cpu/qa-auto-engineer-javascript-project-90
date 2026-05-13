export class DashboardPage {
  constructor(page) {
    this.page = page
    this.dashboardHeading = page.getByRole('heading', {
      name: 'Welcome to the administration',
    })
    this.profileButton = page.getByRole('button', { name: 'Profile' })
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' })
  }

  async logout() {
    await this.profileButton.click()
    await this.logoutMenuItem.click()
  }
}