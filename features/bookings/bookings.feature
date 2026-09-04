@bookings
Feature: Booking API learning roadmap
  @smoke @get
  Scenario: List booking IDs
    When I request all booking IDs
    Then the response status should be 200
    And the response should be JSON
    And the response should be an array of booking IDs
