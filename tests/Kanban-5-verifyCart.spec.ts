// Created By AI
import { test } from '@playwright/test';
import { AddToCartPage } from '../page_objects/AddToCartPage';
import { CartVerifyPage } from '../page_objects/CartVerify';

test.describe('KANBAN-5: Verify Cart Product Name, Price, and Quantity', () => {

  test('Verify Cart items display product name, price, and quantity', async ({ page }) => {
    const addToCartPage = new AddToCartPage(page);
    const cartVerifyPage = new CartVerifyPage(page);

    // Given the user navigates to the storefront
    await addToCartPage.navigate();

    // And the user filters by the "Earrings and anklets" category
    await addToCartPage.clickEarringsAndAnkletsCategory();
    await addToCartPage.verifyCategoryFilterActive();

    // And the user adds "Handcrafted Colorful Beaded Hoop Earrings" to the cart
    await addToCartPage.clickAddHoopEarringsToCart();
    await addToCartPage.verifyAddToCartButtonText('Added!');

    // When the user clicks the Cart button in the navigation header
    await cartVerifyPage.clickCartButton();

    // Then the cart drawer should open and display the cart heading
    await cartVerifyPage.verifyCartDrawerVisible();
    await cartVerifyPage.verifyCartHeadingVisible();

    // And the cart should display the correct product name, price, and quantity
    await cartVerifyPage.verifyCartItemName('Handcrafted Colorful Beaded Hoop Earrings');
    await cartVerifyPage.verifyCartItemPrice('৳ 450');
    await cartVerifyPage.verifyCartItemQuantity('1');
  });

});
