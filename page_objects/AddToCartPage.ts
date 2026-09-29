// Created By AI
import { type Page, type Locator, expect } from '@playwright/test';

export class AddToCartPage {
    readonly page: Page;
    readonly earringsAndAnkletsNavButton: Locator;
    readonly activeCategoryHeading: Locator;
    readonly categoryProductCards: Locator;
    readonly categoryCreationCountText: Locator;
    readonly hoopEarringsTitle: Locator;
    readonly hoopEarringsProductCard: Locator;
    readonly hoopEarringsPrice: Locator;
    readonly hoopEarringsAddToCartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Navigation category button in the top bar
        this.earringsAndAnkletsNavButton = page.getByRole('button', { name: /Earrings and anklets/i }).first();
        // Active category heading in the catalog section
        this.activeCategoryHeading = page.getByRole('heading', { name: 'Earrings and anklets', level: 2 });
        // Catalog product count and items
        // Created By AI: [ALERT: LOCATOR DISCREPANCY & RUNTIME FAILURE]
        // Discrepancy: `getByRole('button', { name: 'Add to ' })` performs a non-exact substring match.
        // In the live DOM, each of the 4 rendered product cards contains two buttons matching this prefix:
        //   1. "Add to Cart" (4 elements)
        //   2. "Add to wishlist" (4 elements)
        // This causes the locator to resolve to 8 elements instead of the expected 4, failing `toHaveCount(4)`.
        // Recommendation: Change `{ name: 'Add to ' }` back to `{ name: 'Add to Cart' }` or `{ name: 'Add to Cart', exact: true }`.
        this.categoryProductCards = page.locator('main').getByRole('button', { name: 'Add to Cart' });
        this.categoryCreationCountText = page.getByText(/Showing \d+ artisan creation\(s\)/i);
        // Specific target hoop earrings card and controls
        this.hoopEarringsTitle = page.getByRole('heading', { name: 'Handcrafted Colorful Beaded Hoop Earrings', level: 3 });
        this.hoopEarringsProductCard = page.locator('div').filter({ has: this.hoopEarringsTitle }).last();
        this.hoopEarringsPrice = this.hoopEarringsProductCard.getByText(/৳\s*450/).first();
        this.hoopEarringsAddToCartButton = this.hoopEarringsProductCard.getByRole('button', { name: /Add to Cart|Added!/i }).first();
    }

    public async navigate(): Promise<void> {
        await this.page.goto('https://falgunishandcraft.com/');
    }

    public async clickEarringsAndAnkletsCategory(): Promise<void> {
        await this.earringsAndAnkletsNavButton.click();
    }

    public async verifyCategoryFilterActive(): Promise<void> {
        await expect(this.activeCategoryHeading).toBeVisible();
    }

    public async verifyAllCategoryProductsDisplayed(expectedCount: number = 4): Promise<void> {
        await expect(this.categoryProductCards).toHaveCount(expectedCount);
        await expect(this.page.getByText(`Showing ${expectedCount} artisan creation(s)`)).toBeVisible();
    }

    public async verifyTargetProductVisible(): Promise<void> {
        await expect(this.hoopEarringsTitle).toBeVisible();
    }

    public async verifyTargetProductPrice(expectedPrice: string = '৳ 450'): Promise<void> {
        await expect(this.hoopEarringsPrice).toBeVisible();
        await expect(this.hoopEarringsPrice).toContainText(expectedPrice);
    }

    public async verifyCategoryProductsVisible(): Promise<void> {
        await expect(this.hoopEarringsProductCard).toBeVisible();
    }

    public async clickAddHoopEarringsToCart(): Promise<void> {
        await this.hoopEarringsAddToCartButton.click();
    }

    public async verifyAddToCartButtonText(expectedText: string): Promise<void> {
        await expect(this.hoopEarringsAddToCartButton).toContainText(expectedText);
    }

    public async verifyAddToCartButtonSuccessStyle(): Promise<void> {
        await expect(this.hoopEarringsAddToCartButton).toHaveCSS('color', 'rgb(5, 150, 105)');
    }
}