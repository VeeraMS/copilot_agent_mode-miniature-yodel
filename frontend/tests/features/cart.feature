Feature: Shopping Cart Icon and Cart Page
  As a customer
  I want to add products to a shopping cart and manage them
  So that I can review my selections before checkout

  # ----------------------------
  # Cart Icon Badge Count
  # ----------------------------

  Scenario: Cart icon is visible in the navigation bar
    Given the user is on the home page
    Then the cart icon should be visible in the navigation bar

  Scenario: Cart icon shows no badge when cart is empty
    Given the user has no items in the cart
    When the user views the navigation bar
    Then the cart icon should not display a badge count

  Scenario: Cart icon shows badge with correct count after adding one item
    Given the user is on the products page
    When the user adds 1 item to the cart
    Then the cart icon badge should display "1"

  Scenario: Cart icon badge updates when adding multiple items
    Given the user has 2 items in the cart
    When the user adds another item to the cart
    Then the cart icon badge should display "3"

  Scenario: Cart icon badge shows 99+ for large quantities
    Given the user has more than 99 items in the cart
    Then the cart icon badge should display "99+"

  # ----------------------------
  # Adding Items to Cart
  # ----------------------------

  Scenario: Add a product to an empty cart
    Given the user is on the products page
    And the cart is empty
    When the user adds "Copilot Plushie" to the cart
    Then the cart should contain 1 item
    And the cart icon badge should display "1"

  Scenario: Add the same product again increases quantity
    Given the user has "Copilot Plushie" with quantity 1 in the cart
    When the user adds "Copilot Plushie" to the cart again
    Then the "Copilot Plushie" quantity should be 2

  Scenario: Add a different product to a non-empty cart
    Given the user has "Copilot Plushie" in the cart
    When the user adds "Octocat Figurine" to the cart
    Then the cart should contain 2 different items

  # ----------------------------
  # Removing Items from Cart
  # ----------------------------

  Scenario: Remove an item from the cart
    Given the user has "Copilot Plushie" and "Octocat Figurine" in the cart
    When the user removes "Copilot Plushie" from the cart
    Then the cart should contain 1 item
    And "Copilot Plushie" should no longer be in the cart

  Scenario: Remove the last item from the cart
    Given the user has only "Copilot Plushie" in the cart
    When the user removes "Copilot Plushie" from the cart
    Then the cart should be empty
    And the empty cart message "Your cart is empty" should be displayed

  Scenario: Decrease item quantity to zero removes the item
    Given the user has "Copilot Plushie" with quantity 1 in the cart
    When the user decreases the quantity of "Copilot Plushie" by 1
    Then "Copilot Plushie" should no longer be in the cart

  # ----------------------------
  # Cart Page Layout
  # ----------------------------

  Scenario: Cart page displays empty state when no items
    Given the cart is empty
    When the user navigates to the cart page
    Then the heading "Your cart is empty" should be displayed
    And a "Browse Products" link should be visible

  Scenario: Cart page displays items with product details
    Given the user has items in the cart
    When the user navigates to the cart page
    Then each item should display the product image
    And each item should display the product name
    And each item should display the unit price
    And each item should display quantity controls
    And each item should display a remove button

  Scenario: Cart page shows quantity controls for each item
    Given the user has "Copilot Plushie" with quantity 2 in the cart
    When the user navigates to the cart page
    Then the quantity for "Copilot Plushie" should show "2"
    And a "+" button should be visible to increase quantity
    And a "-" button should be visible to decrease quantity

  Scenario: Increase item quantity on cart page
    Given the user is on the cart page with "Copilot Plushie" at quantity 1
    When the user clicks the "+" button for "Copilot Plushie"
    Then the quantity for "Copilot Plushie" should update to 2
    And the item subtotal should recalculate

  Scenario: Decrease item quantity on cart page
    Given the user is on the cart page with "Copilot Plushie" at quantity 3
    When the user clicks the "-" button for "Copilot Plushie"
    Then the quantity for "Copilot Plushie" should update to 2
    And the item subtotal should recalculate

  Scenario: Cart page shows order summary sidebar
    Given the user has items in the cart
    When the user navigates to the cart page
    Then the "Order Summary" section should be visible
    And the subtotal should be displayed
    And the shipping cost should be displayed
    And the total should be displayed
    And a "Checkout" button should be visible
    And a "Continue Shopping" link should be visible

  Scenario: Cart page shows discounted prices correctly
    Given the user has a discounted item in the cart
    When the user navigates to the cart page
    Then the original price should be shown with a strikethrough
    And the discounted price should be displayed

  # ----------------------------
  # Shipping Calculation
  # ----------------------------

  Scenario: Shipping fee is $25 when subtotal is below $100
    Given the user has items in the cart with a subtotal of $50.00
    When the user views the order summary
    Then the shipping cost should be "$25.00"
    And the total should be "$75.00"

  Scenario: Free shipping when subtotal is $100 or more
    Given the user has items in the cart with a subtotal of $120.00
    When the user views the order summary
    Then the shipping should display "Free"
    And the total should be "$120.00"

  Scenario: Free shipping threshold message displayed
    Given the user has items in the cart with a subtotal of $80.00
    When the user views the order summary
    Then a message "Add $20.00 more for free shipping!" should be displayed

  Scenario: Free shipping message disappears at threshold
    Given the user has items in the cart with a subtotal of $100.00
    When the user views the order summary
    Then the free shipping threshold message should not be displayed
    And the shipping should display "Free"

  Scenario: Shipping is $0 when cart is empty
    Given the cart is empty
    When the user navigates to the cart page
    Then the empty cart state should be displayed
    And no shipping cost should be shown

  # ----------------------------
  # Cart Persistence
  # ----------------------------

  Scenario: Cart items persist after page refresh
    Given the user has "Copilot Plushie" in the cart
    When the user refreshes the page
    Then "Copilot Plushie" should still be in the cart

  Scenario: Cart items persist across navigation
    Given the user has items in the cart
    When the user navigates to the home page
    And the user navigates back to the cart page
    Then all previously added items should still be in the cart
