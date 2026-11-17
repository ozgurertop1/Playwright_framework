@products
Feature: Product search
  Search results shown in the UI must match what the backend returns.

  Background:
    Given the user is on the products page

  Scenario Outline: UI search results match the search API
    When the user searches for "<term>"
    Then the search results in the UI match the product search API for "<term>"

    Examples:
      | term  |
      | top   |
      | jeans |
      | dress |
