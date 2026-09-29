# Test Plan & Gap Analysis: KANBAN-5
**Issue Key:** [KANBAN-5](https://shawoncse.atlassian.net/browse/KANBAN-5)  
**Parent Epic:** [KANBAN-4](https://shawoncse.atlassian.net/browse/KANBAN-4) (*Verify Cart*)  
**Project:** AgenticTest_Automation (KANBAN)  
**User Story Summary:** As a user, I can see Cart name, price and quantity  
**Target Application:** [Falguni Handcraft](https://falgunishandcraft.com/)  
**Test Engine:** Playwright CLI & Playwright Test Runner  
**Local Snapshot Reference:** `.playwright-cli/page-2026-09-29T16-24-07-135Z.yml`  
**Author:** AI Quality Engineering Agent  
**Date:** September 2026  

---

## Section 1: Test Planning & Gap Analysis

### 1.1 Jira Requirement Criteria
Retrieved directly from Jira Cloud REST API via Jira MCP Server:

* **Story Summary:**
  > "As a user, I can see Cart name,price and quantity"
* **Reported Steps:**
  1. User will click cart and will go to cart page
  2. In cart page product name, price and quantity will show
* **Acceptance Criteria:**
  1. When click cart .cart page will open
  2. In cart page , cart name, quantity and price will show

---

### 1.2 Live Application Exploration & DOM Structural Analysis
Inspected live page state and DOM hierarchy via Playwright CLI low-token snapshots:

1. **Header Cart Trigger (`Cart` vs `Cart <N>`):**
   - **DOM Element:** `<button class="btn btn-primary btn-sm navbar-action-btn">`
   - **Text State:** Renders `Cart` when cart item count is 0, and dynamically transitions to `Cart 1` (or `Cart <N>`) when items are added to the session.
   - **Accessibility & Locator Mapping:** `page.getByRole('button', { name: /^Cart(\s*\d+)?$/i })`.

2. **"Cart Page" vs. Sliding Cart Drawer Architecture:**
   - **Observed Behavior:** Clicking the header Cart button does **not** trigger a full-page URL navigation (no `/cart` route exists). Instead, it mounts a full-height slide-out drawer on the right side of the screen (`.cart-drawer-panel`).
   - **Overlay Container:** `<div class="cart-drawer-panel">` with backdrop overlay `<div class="cart-drawer-backdrop">`.
   - **Header Element:** Heading `<h2 ...>Your Handcrafted Cart (N)</h2>` accompanied by a close button `<button><svg class="lucide-x">...</button>`.

3. **Cart Item Row Hierarchy (When Populated):**
   - **Item Card:** `<div ... border: 1px solid ...>` containing:
     - **Product Title:** `<h4 title="Click to view product details">Handcrafted Colorful Beaded Hoop Earrings</h4>`
     - **Unit Price Display:** `<div style="font-size: 0.88rem; font-weight: 700; color: rgb(192, 82, 13);">৳ 450</div>`
     - **Quantity Controls:** Decrement button `-`, numeric badge/input displaying current quantity (`1`), and increment button `+`.
     - **Item Subtotal / Total:** `৳ 450`
     - **Item Removal / Clear Controls:** Clear all items link and item remove icons.

---

### 1.3 Identified Requirement Gaps & Edge Cases

| Gap ID | Category | Jira Requirement Statement | Live DOM Observation / Gap | Testing Impact & Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **GAP-01** | Missing Precondition | Step 1: "User will click cart... product name, price, quantity will show" | In an empty cart state, opening the cart drawer shows `"Your cart is empty"` and 0 items. Name, price, and quantity only render if an item was previously added. | **Critical:** Core test automation scenario must prepend an item addition step (or inject cart state) to validate AC 2. Empty state must be covered as a distinct negative/edge case. |
| **GAP-02** | Architectural Route Discrepancy | AC 1: "When click cart .cart page will open" | The application is a Single Page Application (SPA); no `/cart` route exists. An animated drawer panel (`.cart-drawer-panel`) slides into view. | Update verification from URL assertion (`expect(page).toHaveURL(/.*cart/)`) to drawer visibility assertion (`expect(cartDrawer).toBeVisible()`). |
| **GAP-03** | Currency & Text Formatting | AC 2: "In cart page, cart name, quantity and price will show" | Price is formatted with Bengali Taka symbol `৳` and whitespace (e.g. `৳ 450`). | POM locators must account for currency glyph and whitespace patterns (`/৳\s*450/`). |
| **GAP-04** | Header Cart Button Dynamic Label | - | Header button text is `Cart` when count = 0, and `Cart 1` when count = 1. | Locators matching header button must be regex-based (`/^Cart(\s*\d+)?$/i`) rather than strict static string. |
| **GAP-05** | Inventory & Quantity Bounds | - | Handcrafted items have finite stock (e.g., Beaded Hoop Earrings: Stock 2). | Test planning must ensure edge tests do not increment quantity past available stock without boundary handling. |

---

### 1.4 Clarifying Questions for Product Owner / Business Analyst
1. **Cart Route vs. Drawer:** Is there any planned standalone `/cart` URL for direct linking/SEO, or should the sliding drawer be treated as the official cart experience across all user stories?
2. **Empty Cart Requirements:** What is the exact expected copy and call-to-action when a user opens the cart with zero items? Currently, it displays "Your Handcrafted Cart (0)" and "Your cart is empty".
3. **Price Currency Consistency:** Should currency assertions enforce `৳` symbol spacing, and will multi-currency conversion be introduced in future sprints?

---

## Section 2: Test Specification & Acceptance Matrix

### 2.1 BDD Acceptance Scenarios (Gherkin Format)

```gherkin
Feature: KANBAN-5 - Verify Cart Items Display (Product Name, Price, and Quantity)
  As a customer of Falguni Handcraft
  I want to view my cart drawer
  So that I can verify the product name, unit price, and quantity of my selected handcrafted jewelry items

  # Scenario-001: P0 Core Acceptance Path (Jira KANBAN-5 Primary Workflow)
  @P0 @Smoke @VideoScope
  Scenario: Verify product name, price, and quantity are accurately displayed in the cart drawer
    Given the user navigates to the Falguni Handcraft storefront
    And the user navigates to the "Earrings and anklets" category
    And the user adds "Handcrafted Colorful Beaded Hoop Earrings" to the cart
    When the user clicks the header Cart button
    Then the cart drawer should open displaying heading "Your Handcrafted Cart"
    And the cart item title should display "Handcrafted Colorful Beaded Hoop Earrings"
    And the cart item price should display "৳ 450"
    And the cart item quantity should display "1"

  # Scenario-002: P1 Functional Variation - Empty Cart Verification
  @P1 @Regression
  Scenario: Verify cart drawer display when zero items have been added
    Given the user is on the homepage with an empty cart
    When the user clicks the header Cart button
    Then the cart drawer should open displaying "Your Handcrafted Cart (0)"
    And an empty cart notification should state "Your cart is empty"
    And no product name, price, or quantity controls should be rendered

  # Scenario-003: P1 Functional Variation - In-Drawer Quantity Increment
  @P1 @Regression
  Scenario: Increment item quantity inside the cart drawer and verify updated quantity and subtotal
    Given the user has "Handcrafted Colorful Beaded Hoop Earrings" with quantity "1" in the cart drawer
    When the user clicks the quantity increment "+" button inside the cart drawer
    Then the item quantity display should update to "2"
    And the subtotal should update to "৳ 900"

  # Scenario-004: P2 Negative / Edge Scenario - Clear All Cart Items
  @P2 @Edge
  Scenario: Clear all items from the cart drawer
    Given the user has items in the cart drawer
    When the user clicks "Clear all items"
    Then all items should be removed from the cart drawer
    And the cart heading should update to "Your Handcrafted Cart (0)"
```

---

### 2.2 Page Object Model (POM) Mapping Matrix

To maintain strict compliance with our automated framework, every Gherkin step maps directly to pre-written Page Object methods in `./page_objects/`:

| Test Action / Assertion | Page Object Class | Method Name | Underlying Selector / Assertion Target |
| :--- | :--- | :--- | :--- |
| Navigate to application | `AddToCartPage` | `navigate()` | `page.goto('https://falgunishandcraft.com/')` |
| Filter by category | `AddToCartPage` | `clickEarringsAndAnkletsCategory()` | `page.getByRole('button', { name: /Earrings and anklets/i }).first()` |
| Add item to cart | `AddToCartPage` | `clickAddHoopEarringsToCart()` | `productCard.getByRole('button', { name: /Add to Cart/i })` |
| Open cart drawer | `CartVerifyPage` | `clickCartButton()` | `page.getByRole('button', { name: /^Cart(\s*\d+)?$/i })` |
| Verify cart drawer & heading | `CartVerifyPage` | `verifyCartHeadingVisible()` | `expect(cartHeading).toBeVisible()` |
| Verify item name in cart | `CartVerifyPage` | `verifyCartItemName(expectedName)` | `expect(cartDrawer.getByText(expectedName)).toBeVisible()` |
| Verify item price in cart | `CartVerifyPage` | `verifyCartItemPrice(expectedPrice)` | `expect(cartDrawer.getByText(expectedPrice)).toBeVisible()` |
| Verify item quantity in cart | `CartVerifyPage` | `verifyCartItemQuantity(expectedQty)` | `expect(cartDrawer.locator(...)).toBeVisible()` |
| Complete item verification | `CartVerifyPage` | `verifyCartItemDetails(name, price, qty)` | Bundled composite verification method |
