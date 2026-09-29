# Comprehensive Testing Strategy: KANBAN-4 & KANBAN-5
**Epic Key:** [KANBAN-4](https://shawoncse.atlassian.net/browse/KANBAN-4) (*Verify Cart*)  
**User Story Key:** [KANBAN-5](https://shawoncse.atlassian.net/browse/KANBAN-5) (*As a user, I can see Cart name, price and quantity*)  
**Project:** AgenticTest_Automation (KANBAN)  
**Application Under Test:** [Falguni Handcraft](https://falgunishandcraft.com/)  
**Test Engine:** Playwright CLI & Playwright Test Runner  
**Local Snapshot Reference:** `.playwright-cli/page-2026-09-29T16-24-07-135Z.yml`  
**Author:** AI Playwright Test Assembly Line  
**Date:** September 2026  

---

## 1. Requirement Data Retrieved from Jira (`KANBAN-4` & `KANBAN-5`)

Using the authenticated Jira MCP server / REST API, the exact epic and story requirement specifications were extracted directly from Jira Cloud:

```text
Epic: KANBAN-4 (Verify Cart)
Story: KANBAN-5 (As a user, I can see Cart name, price and quantity)

User Story Summary:
As a user, I can see Cart name,price and quantity

Steps:
Step 1: User will click cart and will go to cart page
Step 2: In cart page product name, price and quantity will show

Acceptance Criteria:
1. When click cart .cart page will open
2. In cart page , cart name, quantity and price will show
```

---

## 2. Live DOM Crawl & Layout Analysis

A crawl of [https://falgunishandcraft.com/](https://falgunishandcraft.com/) was executed using `playwright-cli` local snapshots:

### 2.1 Navigation Trigger & Dynamic State
* **Element:** Header Cart button `<button class="btn btn-primary btn-sm navbar-action-btn">`.
* **Zero Items State:** Displays text `"Cart"`.
* **Populated Items State:** Dynamically appends the item count: `"Cart 1"` (or `"Cart <N>"`).
* **Selector:** `page.getByRole('button', { name: /^Cart(\s*\d+)?$/i })`.

### 2.2 Cart Architecture: Drawer vs Standalone Page
* **Observed Architecture:** Clicking the Cart button does **not** navigate to a `/cart` route or trigger a full page reload.
* **Component:** In-page sliding modal drawer (`.cart-drawer-panel`) with slide-in animation (`slideInRight`) and background backdrop (`.cart-drawer-backdrop`).
* **Drawer Header:** 
  * Title: `<h2 ...>Your Handcrafted Cart (N)</h2>`
  * Close Button: Circular button with Lucide `x` icon.

### 2.3 Cart Item Structure & Data Layout
When an item (e.g., `Handcrafted Colorful Beaded Hoop Earrings`) is in the cart:
* **Item Card:** Encapsulated inside `div` with border and background styling.
* **Product Title:** `<h4 title="Click to view product details">Handcrafted Colorful Beaded Hoop Earrings</h4>`.
* **Unit Price:** `<div style="font-size: 0.88rem; font-weight: 700; color: rgb(192, 82, 13);">৳ 450</div>`.
* **Quantity Controls:** Decrement button `-`, quantity counter badge/span `1`, increment button `+`.
* **Line Item Total:** `৳ 450`.
* **Subtotal & Checkout:**
  * Subtotal summary: `Subtotal: ৳ 450`.
  * WhatsApp Direct Order CTA: `<button>Checkout via WhatsApp / Email</button>`.
  * Cart Clearing Link: `<button>Clear all items</button>`.

---

## 3. Explicit Requirement Gaps & Missing Business Logic

| Gap ID | Category | Jira Requirement Statement | Live DOM Observation / Gap | Impact & Proposed Solution |
| :--- | :--- | :--- | :--- | :--- |
| **GAP-01** | Missing Precondition | Step 1 & 2: "User will click cart... product name, price and quantity will show" | If the user opens the cart on a clean session, the cart is empty. It displays `"Your cart is empty"` and 0 items. Name, price, and quantity only exist if an item was added prior to opening the cart. | **PO/BA Action:** Explicitly document the precondition "Given at least 1 item is added to the cart" for positive verification, and specify the empty cart state requirements. |
| **GAP-02** | URL Route vs Drawer Modal | AC 1: "When click cart .cart page will open" | The application is a React Single Page Application (SPA). There is no `/cart` URL; it opens an in-page slide-out drawer (`.cart-drawer-panel`). | **PO/BA Action:** Clarify whether a separate `/cart` URL is required for deep-linking/SEO, or if the drawer modal is the permanent production design. |
| **GAP-03** | Currency Formatting | AC 2: "...price will show" | Currency is rendered in Bangladeshi Taka (`৳ 450`) with a non-breaking space between the glyph and the amount. | Standardize currency formatting assertions to account for `৳` and whitespace variations. |
| **GAP-04** | Stock Bounds on Quantity Increment | - | Artisanal products have strict stock limits (e.g. 2 units for Hoop Earrings). In the cart drawer, clicking `+` past stock limit behavior is undefined. | **PO/BA Action:** Define error messaging or button disabling when user attempts to exceed stock quantity in cart. |
| **GAP-05** | Cart Persistence | - | Cart payload is stored in client `localStorage` under `falguni_cart`. Browser reload behavior should be specified. | Verify state persistence across page reload. |

---

## 4. Clarifying Questions for Product Owner & Business Analyst
1. **Standalone Cart URL:** Is a dedicated `/cart` route planned for checkout navigation or analytics, or is the sliding drawer panel intended as the sole cart view?
2. **Empty Cart UX:** When the cart is empty, what specific guidance or call-to-action should be displayed? Currently, it displays "Your Handcrafted Cart (0)" and "Your cart is empty" with no "Continue Shopping" button.
3. **Quantity Ceiling:** If a customer attempts to increment quantity beyond available artisan inventory in the cart drawer, should an alert banner display or should the `+` button disable?
4. **Order Negotiation Flow:** Clicking "Checkout via WhatsApp / Email" generates a pre-filled WhatsApp message. Is WhatsApp checkout the primary checkout mechanism, or will an integrated payment gateway (e.g. SSLCommerz/bKash direct) be added?

---

## 5. Prioritized Test Coverage Matrix

### P0: Critical Acceptance Paths (Smoke & Core Video Scope)
* **Scenario-001:** Open cart drawer with an item and verify product name, price, and quantity.
* **Scenario-002:** Verify header Cart button reflects real-time badge count upon item addition.
* **Scenario-003:** Verify cart drawer opens and closes correctly via the close `(X)` button.

### P1: Functional Variations (Regression Suite)
* **Scenario-004:** Open cart drawer in empty state and verify "Your cart is empty" notification.
* **Scenario-005:** Increment item quantity inside the cart drawer and verify recalculation of item total and subtotal.
* **Scenario-006:** Decrement item quantity inside the cart drawer and verify updated subtotal.
* **Scenario-007:** State persistence: reload page and verify cart items and drawer contents remain intact.

### P2: Edge Cases & Negative Paths
* **Scenario-008:** Clear all items using "Clear all items" and verify transition back to empty state.
* **Scenario-009:** Attempt to increment quantity past available inventory limit.
* **Scenario-010:** Remove single item via the remove icon and verify drawer updates immediately.
