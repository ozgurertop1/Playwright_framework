@cart
Feature: Shopping cart
  Each scenario gets its own fresh account (created via the API),
  so carts never leak between parallel tests.

  Background:
    Given a logged-in user whose account was created via the API
    And the user is on the products page

  @smoke
  Scenario: User adds multiple products to the cart
    When the user adds "Blue Top" to the cart and continues shopping
    And the user adds "Men Tshirt" to the cart and opens the cart
    Then the cart contains 2 products
    And the cart contains "Blue Top"
    And the cart contains "Men Tshirt"

  Scenario: User removes a product from the cart
    When the user adds "Blue Top" to the cart and opens the cart
    And the user removes "Blue Top" from the cart
    Then the cart is empty
