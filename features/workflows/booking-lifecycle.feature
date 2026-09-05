@workflow @regression
Feature: Booking lifecycle workflows
  A realistic authenticated booking journey across multiple API endpoints.

  Scenario: Create, fully update, and retrieve a booking
    Given I have valid authentication credentials
    When I request an authentication token
    Then the response should contain a usable token
    Given I have a valid booking request body
    When I create the booking
    Then the response status should be 200
    Given I have a replacement booking request body
    When I fully update the created booking with my authentication token
    Then the response status should be 200
    And the booking response should match the request body
    When I retrieve the created booking
    Then the response status should be 200
    And the retrieved booking should match the request body
