// Created By AI
import { type Page, type Locator, expect } from '@playwright/test';

export class CartVerifyPage {
  readonly page: Page;
  readonly cartButton: Locator;
  readonly cartDrawer: Locator;
  readonly cartHeading: Locator;
  readonly closeButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly clearAllButton: Locator;
  readonly cartItemTitle: Locator;
  readonly cartItemPrice: Locator;
  readonly cartItemQuantity: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header cart button matching both empty 'Cart' and populated 'Cart 1'
    this.cartButton = page.getByRole('button', { name: /^Cart(\s*\d+)?$/i });

    // Cart drawer container and heading
    this.cartDrawer = page.locator('.cart-drawer-panel');
    this.cartHeading = page.getByRole('heading', { name: /Your Handcrafted Cart/i });
    this.closeButton = this.cartDrawer.locator('button').filter({ has: page.locator('svg') }).first();
    this.emptyCartMessage = this.cartDrawer.getByText(/Your cart is empty/i);
    this.clearAllButton = this.cartDrawer.getByRole('button', { name: /Clear all items/i });

    // Target product elements inside cart drawer
    this.cartItemTitle = this.cartDrawer.getByText('Handcrafted Colorful Beaded Hoop Earrings');
    this.cartItemPrice = this.cartDrawer.getByText(/৳\s*450/).first();
    this.cartItemQuantity = this.cartDrawer.locator('span, div').filter({ hasText: /^1$/ }).first();
    this.deleteButton = this.cartDrawer.locator('button').filter({ has: page.locator('svg') }).last();
  }

  public async clickCartButton(): Promise<void> {
    // Clicks the main navigation/header cart button
    await this.cartButton.click();
  }

  public async closeCartDrawer(): Promise<void> {
    await this.closeButton.click();
  }

  public async verifyCartHeadingVisible(): Promise<void> {
    await expect(this.cartHeading).toBeVisible();
  }

  public async verifyCartDrawerVisible(): Promise<void> {
    await expect(this.cartDrawer).toBeVisible();
  }

  public async verifyCartDrawerHidden(): Promise<void> {
    await expect(this.cartDrawer).not.toBeVisible();
  }

  public async verifyEmptyCartVisible(): Promise<void> {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  public async verifyCartItemName(expectedName: string = 'Handcrafted Colorful Beaded Hoop Earrings'): Promise<void> {
    await expect(this.cartDrawer.getByText(expectedName)).toBeVisible();
  }

  public async verifyCartItemPrice(expectedPrice: string = '৳ 450'): Promise<void> {
    await expect(this.cartDrawer.getByText(new RegExp(expectedPrice)).first()).toBeVisible();
  }

  public async verifyCartItemQuantity(expectedQuantity: string | number = '1'): Promise<void> {
    const qtyLocator = this.cartDrawer.locator('span, div').filter({ hasText: new RegExp(`^${expectedQuantity}$`) }).first();
    await expect(qtyLocator).toBeVisible();
  }

  public async verifyCartItemDetails(
    expectedName: string = 'Handcrafted Colorful Beaded Hoop Earrings',
    expectedPrice: string = '৳ 450',
    expectedQuantity: string | number = '1'
  ): Promise<void> {
    await this.verifyCartItemName(expectedName);
    await this.verifyCartItemPrice(expectedPrice);
    await this.verifyCartItemQuantity(expectedQuantity);
  }

  public async clickClearAll(): Promise<void> {
    await this.clearAllButton.click();
  }
}