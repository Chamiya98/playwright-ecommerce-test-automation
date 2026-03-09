import { test, expect, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ProductPage } from "../pages/ProductPage";
import testData from "../test-data/productData.json";

let home: HomePage;
let searchResults: SearchResultsPage;
let productTab: Page;
let productPageInNewTab: ProductPage;

test.beforeEach(async ({ page, context }) => {
  // Create instances of the page objects
  home = new HomePage(page);

  // Create an instance of SearchResultsPage to use its method for selecting a product
  searchResults = new SearchResultsPage(page);

  // Navigate to the home page
  home.navigate();

  // Search for a product
  await home.searchProduct(testData.product);

  // Wait for the search results page to load and select a product by index, which opens in a new tab
  const [newTab] = await Promise.all([
    context.waitForEvent("page"),
    searchResults.selectProductByIndex(testData.productIndex),
  ]);

  // Assign the new tab to the productTab variable
  productTab = newTab;

  // Wait for the new tab to fully load
  await productTab.waitForLoadState();

  // Create a new instance of ProductPage using the new tab's page object
  productPageInNewTab = new ProductPage(productTab);
});

test("Verify related products section is displayed", async ({ context }) => {
  // Verify that the item title is visible on the product page in the new tab
  await productPageInNewTab.expectItemTitleVisible();

  // Verify that the action buttons are visible on the product page in the new tab
  await productPageInNewTab.expectActionButtonsVisible();
});

test("Verify maximum number of related products", async ({ context }) => {
  // Verify that the similar items heading is visible on the product page in the new tab
  await productPageInNewTab.expectSimilarItemsHeadingVisible();

  // Scroll down by 1000 pixels
  await productTab.mouse.wheel(0, 1000);

  // Get the count of related products and assert that it is 6
  const relatedProductsCount =
    await productPageInNewTab.getRelatedProductsCount();

  // Assert that the count of related products is 6
  expect(relatedProductsCount).toBe(6);
});

test("Verify Add to Cart from related product", async ({ context }) => {
  // Verify that the item title is visible on the product page in the new tab
  await productPageInNewTab.expectItemTitleVisible();

  //const title = await productTab.getByTestId("x-item-title").textContent();

  // Get and log the product title
  const title = await productPageInNewTab.getItemTitleText();
  console.log(title);

  await productPageInNewTab.clickAddToCart();

  // const itemTitle = await productTab
  //   .locator('[data-testid="atc-v3-info"] a')
  //   .innerText();

  const itemTitle = await productPageInNewTab.getAtcItemTitle();

  console.log(itemTitle);
});

test("Verify price range of similar products", async ({ context }) => {
  // Verify that the similar items heading is visible on the product page in the new tab
  await productPageInNewTab.expectSimilarItemsHeadingVisible();

  // Get the price of the main product
  const mainProductPrice = await productPageInNewTab.getProductPrice();

  // Remove any non-numeric characters from the price string and convert it to a float
  const mainPrice = parseFloat(mainProductPrice.replace(/[^0-9.]/g, ""));

  // Scroll down by 1000 pixels
  await productTab.mouse.wheel(0, 1000);

  // Get the count of related products
  const count = await productPageInNewTab.getRelatedProductsCount();

  // Loop through each related product and verify that its price is within the specified range
  for (let i = 0; i < count; i++) {
    // Get the price of the related product by index
    const price = await productPageInNewTab.getRelatedProductPrice(i);

    // Remove any non-numeric characters from the price string and convert it to a float
    const relatedPrice = parseFloat(price.replace(/[^0-9.]/g, ""));

    // Assertion (price range check)
    expect.soft(relatedPrice).toBeGreaterThanOrEqual(mainPrice * 0.5);
    expect.soft(relatedPrice).toBeLessThanOrEqual(mainPrice * 2);
  }
});

test("Verify similar products belong to same category", async ({ context }) => {
  // Verify that the similar items heading is visible on the product page in the new tab
  await productPageInNewTab.expectSimilarItemsHeadingVisible();

  // Scroll down by 1000 pixels
  await productTab.mouse.wheel(0, 1000);

  // Get the count of related products
  const count = await productPageInNewTab.getRelatedProductsCount();

  for (let i = 0; i < count; i++) {
    // Get the title of the related product by index
    const title = await productPageInNewTab.getRelatedProductTitle(i);

    // Check if title contains product category.
    await expect(title.toLowerCase()).toContain(
      testData.productCategory.toLowerCase(),
    );
  }
});

test("Verify main product is not shown in similar product list", async ({
  context,
}) => {
  // Verify that the similar items heading is visible on the product page in the new tab
  await productPageInNewTab.expectSimilarItemsHeadingVisible();

  // Get the title of the main product
  let relatedTitle = "";

  // Get the count of related products
  const count = await productPageInNewTab.getRelatedProductsCount();

  for (let i = 0; i < count; i++) {
    // Get the title of the related product by index
    relatedTitle = await productPageInNewTab.getRelatedProductTitle(i);
  }
  // Scroll down by 1000 pixels
  await productTab.mouse.wheel(0, 1000);

  // Get the title of the main product
  const allTitles: string[] = [];

  for (let i = 0; i < count; i++) {
    const title = await productPageInNewTab.getAtcItemText();
    allTitles.push(title);
  }

  // Assert that the main product title is not present in the list of related product titles
  await expect.soft(allTitles).not.toContain(relatedTitle);
});



test("Verify navigation when clicking similar product", async ({ context }) => {
  // Verify that the similar items heading is visible on the product page in the new tab
  await productPageInNewTab.expectSimilarItemsHeadingVisible();

  // Scroll down by 1000 pixels
  await productTab.mouse.wheel(0, 1000);

  // Capture the related product title before clicking
  const products = productTab.locator(".uV_m.NSYw.RbHS section");
  const relatedTitle = await products.first().locator("h3").innerText();
  console.log("Related Product Title:", relatedTitle);

  // Wait for new tab and click the product
  const [newPage] = await Promise.all([
    productTab.context().waitForEvent("page"),
    products.first().locator("a").click(),
  ]);

  // Wait for the new page to load
  await newPage.waitForLoadState();

  // Capture the title on the product page
  const productPageTitle = await newPage
    .getByTestId("x-item-title")
    .innerText();

  // Assert the clicked product is opened correctly
  await expect(productPageTitle).toContain(relatedTitle);
});

test("Verify 'See All' link", async ({ context }) => {
  // Scroll down by 1000 pixels
  await productTab.mouse.wheel(0, 1000);

  // Verify that the 'See All' link is visible in the related products section
  await productPageInNewTab.expectSeeAllLinkVisible();
});
