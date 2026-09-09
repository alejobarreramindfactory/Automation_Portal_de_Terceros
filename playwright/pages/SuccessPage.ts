import { Page, Locator } from '@playwright/test';

export class SuccessPage {
  readonly page: Page;
  readonly title: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.post-title');
    this.message = page.locator('p.has-text-align-center');
  }

  getTitle(): Locator {
    return this.title;
  }

  getMessage(): Locator {
    return this.message;
  }
}

export default SuccessPage;