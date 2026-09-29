Feature: KANBAN-2 - Add Handcrafted Colorful Beaded Hoop Earrings to Cart
  As a customer on Falguni Handcraft
  I want to browse the Earrings and Anklets category and add Handcrafted Colorful Beaded Hoop Earrings to my cart
  So that I can purchase or negotiate custom sizing for these earrings

  Background:
    Given the user navigates to "https://falgunishandcraft.com/"
    And the storefront is loaded with an empty cart in local storage

  # ============================================================================
  # P0: CRITICAL PATHS (Core Acceptance Criteria of KANBAN-2)
  # ============================================================================

  # Scenario-001
  @P0 @Smoke @CategoryNavigation
  Scenario: Open storefront and filter by Earrings and Anklets category
    Given the user is on the Falguni Handcraft homepage
    When the user clicks the "Earrings and anklets" category button in the navigation bar
    Then the category filter should become active
    And all 4 products belonging to the "Earrings and anklets" category should be displayed in the product grid
    And "Handcrafted Colorful Beaded Hoop Earrings" should be visible in the catalog

  # Scenario-002
  @P0 @Smoke @AddToCart
  Scenario: Add Handcrafted Colorful Beaded Hoop Earrings to cart and verify button state changes to Added
    Given the user is viewing the "Earrings and anklets" category
    And the product card for "Handcrafted Colorful Beaded Hoop Earrings" is visible with price "৳ 450"
    When the user clicks the "Add to Cart" button on "Handcrafted Colorful Beaded Hoop Earrings"
    Then the button text should change from "Add to Cart" to "Added!"
    And the button style should reflect successful addition with green highlight

  # Scenario-003
  @P0 @CartBadge
  Scenario: Verify header Cart button reflects item addition from Earrings and Anklets category
    Given the user has filtered by "Earrings and anklets" category
    When the user clicks "Add to Cart" on "Handcrafted Colorful Beaded Hoop Earrings"
    Then the header "Cart" button should display a count badge showing "1"

  # Scenario-004
  @P0 @StatePersistence
  Scenario: Verify cart payload stored in browser local storage upon adding target earrings
    Given the user is on the "Earrings and anklets" category
    When the user adds "Handcrafted Colorful Beaded Hoop Earrings" to the cart
    Then the browser "localStorage" under key "falguni_cart" should contain an entry with:
      | id              | p-1790389470386                             |
      | title           | Handcrafted Colorful Beaded Hoop Earrings   |
      | category        | earrings-and-anklets                        |
      | price           | 450                                         |
      | quantity        | 1                                           |

  # ============================================================================
  # P1: FUNCTIONAL VARIATIONS (Alternative Paths & Card Interactivity)
  # ============================================================================

  # Scenario-005
  @P1 @CategoryCardNavigation
  Scenario: Navigate to Earrings and Anklets via homepage collection cards
    Given the user scrolls to the "Explore Handcrafted Jewelry Collections" section
    When the user clicks on the "Earrings and anklets" collection card
    Then the page should scroll to the catalog grid filtered to show the 4 earrings and anklets items
    And "Handcrafted Colorful Beaded Hoop Earrings" should be visible

  # Scenario-006
  @P1 @QuantitySelector
  Scenario: Increment quantity selector on product card before adding earrings to cart
    Given the user locates the "Handcrafted Colorful Beaded Hoop Earrings" product card
    When the user clicks the "+" quantity button on the card once
    Then the card quantity indicator should display "2"
    When the user clicks the "Add to Cart" button
    Then the button state should transition to "Added!"
    And the header cart badge should display "2"

  # Scenario-007
  @P1 @TransientStateReset
  Scenario: Verify Added button state automatically reverts to Add to Cart after two seconds
    Given the user clicks "Add to Cart" on "Handcrafted Colorful Beaded Hoop Earrings"
    Then the button should immediately display "Added!"
    When the user waits for 2100 milliseconds
    Then the button label should revert back to "Add to Cart"

  # Scenario-008
  @P1 @CartDrawerVerification
  Scenario: Open cart drawer to confirm added earrings details and subtotal
    Given the user has added "Handcrafted Colorful Beaded Hoop Earrings" with quantity 1
    When the user clicks the header "Cart" button
    Then the cart drawer panel should open
    And the drawer should list "Handcrafted Colorful Beaded Hoop Earrings"
    And the unit price should show "৳ 450"
    And the quantity should show "1"
    And the cart subtotal should calculate to "৳ 450"

  # Scenario-009
  @P1 @CategorySwitching
  Scenario: Switch between categories and return to verify item availability
    Given the user is on the "Earrings and anklets" category
    When the user clicks "Seed beads jewellery" in the category bar
    Then the catalog should display 15 seed bead items
    When the user clicks "Earrings and anklets" in the category bar again
    Then the catalog should return to displaying the 4 earrings and anklets items
    And "Handcrafted Colorful Beaded Hoop Earrings" should retain its initial actionable state

  # ============================================================================
  # P2: EDGE CASES & NEGATIVE SCENARIOS (Boundary & Resilience)
  # ============================================================================

  # Scenario-010
  @P2 @InventoryBoundary
  Scenario: Attempt to exceed available product stock on product card
    Given the target product "Handcrafted Colorful Beaded Hoop Earrings" has available stock of 2 units
    When the user clicks the "+" button 2 times on the product card to reach 3 units
    Then the system should enforce the stock limit of 2 units or alert the user to identify GAP-01

  # Scenario-011
  @P2 @Debounce @RapidClicks
  Scenario: Rapid consecutive clicks on Add to Cart button
    Given the user is on the "Handcrafted Colorful Beaded Hoop Earrings" product card
    When the user rapidly double-clicks the "Add to Cart" button within 300 milliseconds
    Then the cart should accurately reflect intended quantity additions without race conditions or duplicate entries

  # Scenario-012
  @P2 @Persistence @PageRefresh
  Scenario: Cart state retention across page refresh after adding hoop earrings
    Given the user has added "Handcrafted Colorful Beaded Hoop Earrings" to the cart
    And the header cart badge displays "1"
    When the user reloads the browser page
    Then the header cart badge should continue displaying "1"
    And opening the cart drawer should display "Handcrafted Colorful Beaded Hoop Earrings" persisted from local storage
