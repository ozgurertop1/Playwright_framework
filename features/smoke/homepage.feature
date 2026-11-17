@smoke
Feature: Homepage
  The storefront must load with its core building blocks,
  otherwise no other journey can work.

  Scenario: Homepage loads with navigation and featured products
    Given the user opens the homepage
    Then the page title is "Automation Exercise"
    And the main navigation, slider and featured products are visible
