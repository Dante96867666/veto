/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here if needed
    }
  }
}

// Example custom command:
// Cypress.Commands.add('login', (username: string, password: string) => {
//   cy.get('[data-cy="username-input"]').type(username);
//   cy.get('[data-cy="password-input"]').type(password);
//   cy.get('[data-cy="login-button"]').click();
// });

export {};
