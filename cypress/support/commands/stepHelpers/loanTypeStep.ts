type LoanType =
  | 'business-loan-button'
  | 'line-of-credit-button'
  | 'both-button';

Cypress.Commands.add(
  'fillLoanTypeStep',
  (loanType: LoanType = 'business-loan-button') => {
    cy.log(`Attempting to select loan type: ${loanType}`);
    cy.get(`[data-cy=${loanType}]`).click();
    cy.get('[data-cy=submit-step]').click();
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      fillLoanTypeStep(loanType?: LoanType): Chainable<void>;
    }
  }
}
