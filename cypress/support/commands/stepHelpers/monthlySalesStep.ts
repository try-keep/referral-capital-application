export const fillMonthlySalesStep = (
  options: { monthlySales?: string } = {}
) => {
  const { monthlySales = '10000' } = options;

  cy.get('input[id="monthlySales"]').type(monthlySales);
  cy.get('button[type="submit"]').click();
};

declare global {
  namespace Cypress {
    interface Chainable {
      fillMonthlySalesStep: typeof fillMonthlySalesStep;
    }
  }
}

Cypress.Commands.add('fillMonthlySalesStep', fillMonthlySalesStep);
