// Created By AI
import { test } from '@playwright/test';
import { AddToCartPage } from '../page_objects/AddToCartPage';

test.describe('KANBAN-2: Add Handcrafted Colorful Beaded Hoop Earrings to Cart', () => {

  // Scenario-001
  test('Scenario-001: Open storefront and filter by Earrings and Anklets category', async ({ page }) => {
    const addToCartPage = new AddToCartPage(page);

    // Given the user is on the Falguni Handcraft homepage
    await addToCartPage.navigate();

    // When the user clicks the "Earrings and anklets" category button in the navigation bar
    await addToCartPage.clickEarringsAndAnkletsCategory();

    // Then the category filter should become active
    await addToCartPage.verifyCategoryFilterActive();

    // And all 4 products belonging to the "Earrings and anklets" category should be displayed in the product grid
    await addToCartPage.verifyAllCategoryProductsDisplayed(4);

    // And "Handcrafted Colorful Beaded Hoop Earrings" should be visible in the catalog
    await addToCartPage.verifyTargetProductVisible();
  });

  // Scenario-002
  test('Scenario-002: Add Handcrafted Colorful Beaded Hoop Earrings to cart and verify button state changes to Added', async ({ page }) => {
    const addToCartPage = new AddToCartPage(page);

    // Given the user is viewing the "Earrings and anklets" category
    await addToCartPage.navigate();
    await addToCartPage.clickEarringsAndAnkletsCategory();
    await addToCartPage.verifyCategoryFilterActive();

    // And the product card for "Handcrafted Colorful Beaded Hoop Earrings" is visible with price "৳ 450"
    await addToCartPage.verifyTargetProductVisible();
    await addToCartPage.verifyTargetProductPrice('৳ 450');

    // When the user clicks the "Add to Cart" button on "Handcrafted Colorful Beaded Hoop Earrings"
    await addToCartPage.clickAddHoopEarringsToCart();

    // Then the button text should change from "Add to Cart" to "Added!"
    await addToCartPage.verifyAddToCartButtonText('Added!');

    // And the button style should reflect successful addition with green highlight
    await addToCartPage.verifyAddToCartButtonSuccessStyle();
  });

});
