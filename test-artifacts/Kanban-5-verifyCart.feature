Feature: KANBAN-5 - Verify Cart Items Display (Product Name, Price, and Quantity)
  As a customer on Falguni Handcraft
  I want to view my cart drawer
  So that I can verify the product name, unit price, and quantity of my selected handcrafted jewelry items

  Background:
    Given the user navigates to "https://falgunishandcraft.com/"
    And the storefront is loaded

  # ============================================================================
  # P0: CRITICAL PATHS (Core Acceptance Criteria of KANBAN-5)
  # ============================================================================

  # Scenario-001
  @P0 @Smoke @CartVerification @VideoScope
  Scenario: Open cart drawer and verify product name, price, and quantity for added item
    Given the user navigates to the "Earrings and anklets" category
    And the user adds "Handcrafted Colorful Beaded Hoop Earrings" to the cart
    When the user clicks the header Cart button
    Then the cart drawer should slide open displaying heading "Your Handcrafted Cart"
    And the cart item title should display "Handcrafted Colorful Beaded Hoop Earrings"
    And the cart item price should display "৳ 450"
    And the cart item quantity should display "1"

  # Scenario-002
  @P0 @CartDrawerOpenClose
  Scenario: Open and close the cart drawer via header and close controls
    Given the user is on the storefront
    When the user clicks the header Cart button
    Then the cart drawer panel should be visible
    When the user clicks the cart drawer close button
    Then the cart drawer panel should no longer be visible

  # ============================================================================
  # P1: FUNCTIONAL VARIATIONS (Regression Suite)
  # ============================================================================

  # Scenario-003
  @P1 @EmptyCart
  Scenario: Verify cart drawer state when cart contains zero items
    Given the user has an empty cart
    When the user clicks the header Cart button
    Then the cart drawer should open displaying "Your Handcrafted Cart (0)"
    And the empty cart notification should display "Your cart is empty"
    And no product items should be visible in the cart drawer

  # Scenario-004
  @P1 @CartQuantityIncrement
  Scenario: Increment item quantity inside the cart drawer and verify updated quantity and subtotal
    Given the user has "Handcrafted Colorful Beaded Hoop Earrings" with quantity "1" in the cart drawer
    When the user clicks the quantity increment button in the cart drawer
    Then the item quantity display should update to "2"
    And the cart subtotal should update to "৳ 900"

  # Scenario-005
  @P1 @CartStatePersistence
  Scenario: Verify cart drawer contents persist across page refresh
    Given the user has added "Handcrafted Colorful Beaded Hoop Earrings" to the cart
    When the user refreshes the browser page
    And the user opens the cart drawer
    Then "Handcrafted Colorful Beaded Hoop Earrings" should still be present in the cart drawer
    And the quantity should remain "1"
    And the price should remain "৳ 450"

  # ============================================================================
  # P2: EDGE CASES & NEGATIVE PATHS
  # ============================================================================

  # Scenario-006
  @P2 @ClearAllItems
  Scenario: Clear all items from the cart drawer
    Given the user has items in the cart drawer
    When the user clicks "Clear all items"
    Then all items should be removed from the cart drawer
    And the cart heading should update to "Your Handcrafted Cart (0)"
    And the empty cart message "Your cart is empty" should be displayed

  # Scenario-007
  @P2 @RemoveSingleItem
  Scenario: Remove a single item from the cart drawer using the remove icon
    Given the user has "Handcrafted Colorful Beaded Hoop Earrings" in the cart drawer
    When the user clicks the remove item button for that product
    Then the item should be removed from the cart drawer
    And the cart subtotal should update to "৳ 0"
