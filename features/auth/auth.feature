@auth
Feature: Authentication API learning roadmap
  @smoke 
  Scenario: Create an authentication token with valid credentials
    Given I have valid authentication credentials
    When I request an authentication token
    Then the response status should be 200
    And the response should contain a usable token
