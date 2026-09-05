@workflow @regression
Feature: Partial booking update workflows
  A PATCH request should change only the requested fields.

  Scenario: Partially update a booking and preserve untouched fields
    Given I have a valid booking request body
    When I create the booking
    Then the response status should be 200
    Given I have valid authentication credentials
    When I request an authentication token
    Then the response should contain a usable token
    Given I have a partial booking update body
    When I partially update the created booking with my authentication token
    Then the response status should be 200
    And the booking response should include the partial update and preserve other fields
    When I retrieve the created booking
    Then the response status should be 200
    And the booking response should include the partial update and preserve other fields
