@workflow @regression
Feature: Booking authorization and safety workflows
  Failed mutations must not change or delete a booking.

  @negative @integrity
  Scenario: Unauthenticated partial update does not corrupt a booking
    Given I have a valid booking request body
    When I create the booking
    Then the response status should be 200
    Given I have a partial booking update body
    When I attempt to partially update the created booking without authentication
    Then the response status should be 403
    When I retrieve the created booking
    Then the response status should be 200
    And the retrieved booking should match the original booking

  @delete
  Scenario: Authenticated delete removes a created booking
    Given I have a valid booking request body
    When I create the booking
    Then the response status should be 200
    Given I have valid authentication credentials
    When I request an authentication token
    Then the response should contain a usable token
    When I delete the created booking with my authentication token
    Then the response status should be 201
    When I retrieve the created booking
    Then the response status should be 404

  @negative @delete @integrity
  Scenario: Unauthenticated delete does not remove a booking
    Given I have a valid booking request body
    When I create the booking
    Then the response status should be 200
    When I delete the created booking without authentication
    Then the response status should be 403
    When I retrieve the created booking
    Then the response status should be 200
    And the retrieved booking should match the request body
