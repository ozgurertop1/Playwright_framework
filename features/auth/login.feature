@auth
Feature: User login
  As a registered customer
  I want to log in to my account
  So that I can shop with my saved details

  Test accounts are created and deleted through the API,
  so UI tests never spend time on the registration form.

  Background:
    Given the user is on the login page

  @smoke
  Scenario: Registered user logs in successfully
    Given a new user account is created via the API
    When the user logs in with valid credentials
    Then the user is logged in with their name shown in the header

  Scenario: Logged-in user can log out
    Given a new user account is created via the API
    And the user logs in with valid credentials
    When the user logs out
    Then the user is back on the login page and no longer logged in

  Scenario: Login fails with a wrong password
    Given a new user account is created via the API
    When the user logs in with the correct email but a wrong password
    Then the login error "Your email or password is incorrect!" is shown

  Scenario Outline: Login fails for accounts that do not exist
    When the user logs in with "<credentials>" credentials
    Then the login error "Your email or password is incorrect!" is shown

    Examples:
      | credentials                       |
      | unregistered email                |
      | unregistered plus-addressed email |
