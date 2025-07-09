export const fillFundingAmountStep = (
  options: { fundingAmount?: string; fundingTimeline?: string } = {}
) => {
  const { fundingAmount = '50000', fundingTimeline = 'asap' } = options;

  cy.get('input[id="fundingAmount"]').type(fundingAmount);
  cy.get('select[id="fundingTimeline"]').select(fundingTimeline);
  cy.get('button[type="submit"]').click();
};

declare global {
  namespace Cypress {
    interface Chainable {
      fillFundingAmountStep: typeof fillFundingAmountStep;
    }
  }
}

Cypress.Commands.add('fillFundingAmountStep', fillFundingAmountStep);
