export const fillExistingLoansStep = () => {
  cy.contains('button', 'No').click();
};

declare global {
  namespace Cypress {
    interface Chainable {
      fillExistingLoansStep: typeof fillExistingLoansStep;
    }
  }
}

Cypress.Commands.add('fillExistingLoansStep', fillExistingLoansStep);
