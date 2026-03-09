import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
  readonly page: Page;
  readonly productItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productItems = page.locator('ul.srp-results > li');
  }

  async selectProductByIndex(index: number) {
  await this.productItems.nth(index).click();
}

async selectProductByName(productName: string) {
  // Option 1: Use getByText if product name is visible in the locator
  await this.page.getByText(productName, { exact: true }).click();
}

}