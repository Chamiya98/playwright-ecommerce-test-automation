import { Page, Locator, expect } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly itemTitle: Locator;
  readonly addToCartButton: Locator;
  readonly watchButton: Locator;
  readonly buyItNowButton: Locator;
  readonly similarItemsHeading: Locator;
  readonly similarRelatedProducts: Locator;
  readonly seeAllLink: Locator;
  readonly atcInfoLink: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemTitle = page.getByTestId("x-item-title");
    this.addToCartButton = page .getByTestId("x-atc-action").getByTestId("ux-call-to-action");
    this.watchButton = page.getByTestId("x-watch-action").getByTestId("ux-call-to-action");
    this.buyItNowButton = page.getByRole("button", { name: "Buy It Now" });
    this.similarItemsHeading = page.getByRole("heading", {name: "Similar items", });
    //this.similarRelatedProducts = page.locator("div.uV_m.NSYw.RbHS section.TzR-.RbHS div.wwfl",);
    this.seeAllLink = page.getByTestId("x-rx-slot-101875").getByRole("link", { name: "See all" });
    this.atcInfoLink = page.locator('[data-testid="atc-v3-info"] a');
    this.productPrice = page.locator('.x-price-primary .ux-textspans').first();
     this.similarRelatedProducts = page.locator('.uV_m.NSYw.RbHS section');
  }

  async expectItemTitleVisible() {
    await expect(this.itemTitle).toBeVisible();
  }

  async expectActionButtonsVisible() {
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.watchButton).toBeVisible();
    await expect(this.buyItNowButton).toBeVisible();
    
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }

  async expectSimilarItemsHeadingVisible() {
    await expect(this.similarItemsHeading).toBeVisible();
  }

  async expectSeeAllLinkVisible() {
    await expect(this.seeAllLink).toBeVisible();
  }

  async getRelatedProductsCount() {
    await this.similarRelatedProducts.first().waitFor({ timeout: 5000 });
    return await this.similarRelatedProducts.count();
  }

  async getItemTitleText(): Promise<string | null> {
    return await this.itemTitle.textContent();
  }

  async getAtcItemText(): Promise<string> {
    return await this.itemTitle.innerText();
  }

  async getAtcItemTitle(): Promise<string> {
    return await this.atcInfoLink.innerText();
  }

  async getProductPrice(): Promise<string> {
  return await this.productPrice.innerText();
}

// Get price of a related product by index
  async getRelatedProductPrice(index: number): Promise<string> {
    return await this.similarRelatedProducts
      .nth(index)
      .locator('.aQ4i span[role="text"]') // price inside that product
      .innerText();
  }

   async getRelatedProductTitle(index: number): Promise<string> {
    return await this.similarRelatedProducts.nth(index).locator('h3').innerText();
  }

}

