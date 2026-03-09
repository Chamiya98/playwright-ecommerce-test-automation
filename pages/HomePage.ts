import { Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly searchfieldInput;
  readonly searchButton;

  constructor(page: Page) {
    this.page = page;
    this.searchfieldInput = this.page.getByRole("combobox", {
      name: "Search for anything",
    });
    this.searchButton = this.page.getByRole("button", {
      name: "Search",
      exact: true,
    });
  }

  async navigate() {
    await this.page.goto("/");
  }

  async searchProduct(product: string) {
    await this.searchfieldInput.fill(product);
    await this.searchButton.click();
  }
}
