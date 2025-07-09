export const fillFundingPurposeStep = (
  options: { fundingPurpose?: string } = {}
) => {
  const { fundingPurpose = 'expansion' } = options;

  cy.get('select[id="fundingPurpose"]').select(fundingPurpose);
  cy.get('button[type="submit"]').click();
};

declare global {
  namespace Cypress {
    interface Chainable {
      fillFundingPurposeStep: typeof fillFundingPurposeStep;
    }
  }
}

Cypress.Commands.add('fillFundingPurposeStep', fillFundingPurposeStep);
