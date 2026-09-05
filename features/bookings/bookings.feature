@bookings
Feature: Booking API learning roadmap
  @smoke @get
  Scenario: List booking IDs
    When I request all booking IDs
    Then the response status should be 200
    And the response should be JSON
    And the response should be an array of booking IDs

  @smoke @post
  Scenario: Create a booking with valid data
    Given I have a valid booking request body
    When I create the booking
    Then the response status should be 200
    And the response should contain a generated booking ID
    And the created booking should match the request body

  @post @persistence
  Scenario: Created booking can be retrieved
    Given I have a valid booking request body
    When I create the booking
    And I retrieve the created booking
    Then the response status should be 200
    And the retrieved booking should match the request body

  @negative @get
  Scenario: Unknown booking ID is not found
    When I request booking ID 999999999
    Then the response status should be 404
    And the response should say booking was not found

  @get @query
  Scenario: Created booking can be found by name
    Given I have a valid booking request body
    When I create the booking
    And I filter bookings using the created booking name
    Then the response status should be 200
    And the filtered booking IDs should include the created booking ID

  @get @contract
  Scenario: Retrieved booking has the expected field types
    Given I have a valid booking request body
    When I create the booking
    And I retrieve the created booking
    Then the response status should be 200
    And the retrieved booking should have the expected field types

  @get @query
  Scenario: Booking IDs can be filtered by check-in date
    When I filter booking IDs by check-in date "2018-01-01"
    Then the response status should be 200
    And the response should be an array of booking IDs

  @post @data-driven
  Scenario Outline: Booking can be created with different valid data
    Given I have a booking request body for "<firstname>" "<lastname>" costing <totalprice>
    When I create the booking
    Then the response status should be 200
    And the created booking should match the request body

    Examples:
      | firstname     | lastname | totalprice |
      | PortfolioAnna | Green    | 1          |
      | PortfolioBen  | Stone    | 111        |
      | PortfolioCara | Jones    | 999        |

  @get @schema
  Scenario: Retrieved booking matches the response schema
    Given I have a valid booking request body
    When I create the booking
    And I retrieve the created booking
    Then the response status should be 200
    And the retrieved booking should match the booking response schema
