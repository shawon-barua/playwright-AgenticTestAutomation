# Comprehensive Testing Strategy: KANBAN-2
**Issue Key:** [KANBAN-2](https://shawoncse.atlassian.net/browse/KANBAN-2)  
**Parent Epic:** [KANBAN-1](https://shawoncse.atlassian.net/browse/KANBAN-1) (*Add product Cart*)  
**Project:** AgenticTest_Automation (KANBAN)  
**User Story Summary:** As a user, I want to add Handcrafted Colorful Beaded Hoop Earrings to cart  
**Application Under Test:** [Falguni Handcraft](https://falgunishandcraft.com/)  
**Target Category:** Earrings and anklets (`earrings-and-anklets`)  
**Target Item:** `Handcrafted Colorful Beaded Hoop Earrings` (ID: `p-1790389470386`, Price: ৳450, Stock: 2 units)  
**Author:** Playwright Test Planner Agent  
**Date:** September 2026  

---

## 1. Requirement Data Retrieved from Jira (`KANBAN-2`)

Using the authenticated Jira MCP server, the exact requirement specifications were extracted directly from Jira Cloud:

```text
Story Summary: As a user, I want to add Handcrafted Colorful Beaded Hoop Earrings to cart

Step : 
   1. User will open https://falgunishandcraft.com/
   2. Than user will go to earrings and anklets category
   3. From this category user can add Handcrafted Colorful Beeded Hoop to cart using Add to cart button.

Acceptance Criteria : 
   1. https://falgunishandcraft.com/ will open
   2. Earrings and anklets category all product will show
   3. When add to cart to button clicked it will show added in place of add to cart.
```

---

## 2. Live DOM Crawl & Layout Analysis

A crawl of [https://falgunishandcraft.com/](https://falgunishandcraft.com/) was performed using Playwright MCP to analyze the real DOM elements against the ticket:

### 2.1 Category Navigation Architecture
* **Top Navigation Bar:** Contains horizontal category filter buttons.
  * Selector: `page.getByRole('button', { name: 'Earrings and anklets 4' })`
  * Action: Filters the catalog in-place without a full page refresh, displaying all 4 items belonging to the category.
* **Homepage Collection Grid:**
  * Selector: `.category-card` with heading `Earrings and anklets`.

### 2.2 Category Product Set (`earrings-and-anklets`)
The category renders exactly 4 products:
1. `Handcrafted Elephant Charm Beaded Anklet` (৳350, In Stock: 15)
2. **`Handcrafted Colorful Beaded Hoop Earrings`** (৳450, In Stock: 2) -> **Target item for KANBAN-2**
3. `Handcrafted Cherry Beaded Anklet / Bracelet` (৳250, In Stock: 15)
4. `Handmade Seed Bead Dangle Earrings` (৳750, In Stock: 3)

### 2.3 Product Card DOM & Add to Cart Micro-Interactions
* **Card Container:** Contains thumbnail, title, price (`৳ 450`), stock indicator (`In Stock (2)`), and action controls.
* **Quantity Controls:** Decrement button `-`, quantity counter `<span>1</span>`, and increment button `+`.
* **Add to Cart CTA:**
  * Default State: Shopping bag icon + text `"Add to Cart"`, class `.btn.btn-secondary`.
  * Click Action: Invokes `addToCart(product, quantity)`.
  * Feedback State: Background shifts to green (`#ecfdf5`), border shifts to green (`#059669`), icon updates to checkmark, and label changes to `"Added!"`.
  * Reversion: The client bundle uses `setTimeout(() => setAdded(false), 2000)`. After 2.0 seconds, the button automatically flips back to `"Add to Cart"`.
  * Cart State: Item is appended to `localStorage.falguni_cart` and the header Cart button badge increments to `1`.

---

## 3. Explicit Requirement Gaps & Missing Business Logic (For PO / BA)

| Gap ID | Area | Current DOM / Code Reality | Missing Business Logic in KANBAN-2 | Impact / Severity |
|---|---|---|---|---|
| **GAP-01** | **Inventory Ceiling & Stock Limit** | `Handcrafted Colorful Beaded Hoop Earrings` has **only 2 units in stock** (`stock: 2`). The card selector allows clicking `+` past 2 (e.g. 5, 10). | Ticket does not state whether the `+` button should be capped at 2 or display an error if a user exceeds available stock. | **High** (Risk of overselling rare artisan pieces) |
| **GAP-02** | **"Added!" State Timeout** | In the live application, `"Added!"` displays for only **2 seconds** before reverting to `"Add to Cart"`. | AC-3 specifies `"it will show added in place of add to cart"` without mentioning whether this is transient flash feedback or persistent. | **Medium** (Flaky test assertions if timeout is unspecified) |
| **GAP-03** | **Cart Badge Count Propagation** | Adding an item updates `localStorage` and header Cart badge, but AC-3 does not require badge verification. | The requirement should explicitly verify that the top cart badge transitions from empty to `1` (or `+quantity`). | **Medium** (State propagation unverified) |
| **GAP-04** | **Cart Drawer Trigger Behavior** | Clicking "Add to Cart" on the card does **not** open the cart drawer; it only updates the button label and badge. | Clarify whether the cart drawer should remain closed or automatically slide open upon addition. | **Low** (UX preference) |
| **GAP-05** | **Rapid Consecutive Add Clicks** | Clicking "Add to Cart" multiple times adds duplicate quantities to the cart without debouncing. | Clarify if rapid repeated clicks should be debounced or blocked while `"Added!"` is active. | **Medium** (Accidental duplicate orders) |

---

## 4. Clarifying Questions for Product Team & Designers

1. **Assertion Window for "Added!" State:**  
   * Since the frontend automatically resets the button label to `"Add to Cart"` after 2000ms, should automated tests assert this transition within the 2-second window?
2. **Low-Stock Safeguard:**  
   * Because this specific earring item has limited inventory (2 units), should the `+` button disable when quantity equals 2, or should a toast warn the user: *"Maximum available stock reached"*?
3. **Cart Badge Indicator:**  
   * When `Handcrafted Colorful Beaded Hoop Earrings` is added, should the header button display `Cart 1` or automatically slide open the cart drawer?
4. **Category Count Alignment:**  
   * The category button displays `Earrings and anklets 4`. Should AC-2 formally verify that this badge count (`4`) exactly matches the count of rendered product cards?

---

## 5. Prioritized Regression Structure for KANBAN-2

### **P0: Critical Path (Direct Acceptance Criteria of KANBAN-2)**
* **P0-01 (AC-1):** Open `https://falgunishandcraft.com/` and confirm homepage loads with HTTP 200.
* **P0-02 (AC-2):** Navigate to `Earrings and anklets` category and verify all 4 products render.
* **P0-03 (AC-3):** Click "Add to Cart" on `Handcrafted Colorful Beaded Hoop Earrings` and verify button text toggles to `"Added!"` with green styling.
* **P0-04 (State):** Verify `localStorage.falguni_cart` stores item `p-1790389470386` with price `450` and quantity `1`.
* **P0-05 (Badge):** Verify the header Cart button displays a badge count of `1`.

### **P1: Functional Variations (Category & Card Operations)**
* **P1-01:** Navigate to `Earrings and anklets` via the top category button vs the homepage category card.
* **P1-02:** Increment quantity to `2` using the `+` button on the product card before clicking "Add to Cart", verifying badge becomes `2`.
* **P1-03:** Verify button automatically reverts from `"Added!"` back to `"Add to Cart"` after 2000 milliseconds.
* **P1-04:** Open the cart drawer after adding and verify `Handcrafted Colorful Beaded Hoop Earrings` appears with title, unit price ৳450, quantity 1, and subtotal ৳450.
* **P1-05:** Switch to another category (e.g. `Seed beads jewellery`) and return to `Earrings and anklets` to verify filter persistence.

### **P2: Edge Cases & Negative Paths**
* **P2-01 (Stock Exceeded):** Attempt to increment quantity past the 2 units available in stock.
* **P2-02 (Rapid Clicks):** Click "Add to Cart" rapidly 3 times to verify whether debouncing prevents duplicate additions.
* **P2-03 (Page Refresh):** Add the earring product, refresh the browser, and verify cart badge and local storage retain the item.
* **P2-04 (Empty Filter Fallback):** Filter by category on a throttled network connection to ensure product grid does not flash an empty or broken state.

---

## 6. Live DOM Selectors for KANBAN-2 Implementation

| Element | Live Playwright Selector | Expected Target |
|---|---|---|
| **Category Nav Button** | `page.getByRole('button', { name: 'Earrings and anklets 4' })` | Top bar filter button |
| **Category Card** | `page.locator('.category-card', { hasText: 'Earrings and anklets' })` | Homepage collection card |
| **Filtered Category Products** | `page.locator('.product-card, [class*="product"]')` | Resolves to 4 items |
| **Target Product Card** | `page.locator('.product-card', { hasText: 'Handcrafted Colorful Beaded Hoop Earrings' })` | Target earring card |
| **Add to Cart CTA** | `page.locator('.product-card', { hasText: 'Handcrafted Colorful Beaded Hoop Earrings' }).getByRole('button', { name: /Add to Cart/i })` | Pre-click button |
| **Added State CTA** | `page.locator('.product-card', { hasText: 'Handcrafted Colorful Beaded Hoop Earrings' }).getByRole('button', { name: /Added!/i })` | Post-click button |
| **Quantity Increment (+)** | `page.locator('.product-card', { hasText: 'Handcrafted Colorful Beaded Hoop Earrings' }).locator('button').nth(1)` | Card `+` button |
| **Header Cart Button** | `page.getByRole('button', { name: /Cart/i })` | Header badge indicator |
