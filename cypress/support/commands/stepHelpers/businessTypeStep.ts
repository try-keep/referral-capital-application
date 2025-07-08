export const fillBusinessTypeStep = (
  options: {
    entityType?: string;
    businessName?: string;
    timeInBusiness?: string;
  } = {}
) => {
  const {
    entityType = 'Corporation',
    businessName = 'Ducks for Rent Inc.',
    timeInBusiness = '6–12 months',
  } = options;

  cy.get('select[id="entityType"]').select(entityType);
  cy.get('input[id="legalBusinessName"]').type(businessName);
  cy.get('select[id="timeInBusiness"]').select(timeInBusiness);

  cy.get('button[type="submit"]').click();
};

declare global {
  namespace Cypress {
    interface Chainable {
      fillBusinessTypeStep: typeof fillBusinessTypeStep;
    }
  }
}

Cypress.Commands.add('fillBusinessTypeStep', fillBusinessTypeStep);
