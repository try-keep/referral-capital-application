export const fillBusinessOwnerStep = (options?: {
  authorizedToRequestCapital?: boolean;
  owns50PercentOrMore?: boolean;
}) => {
  const { authorizedToRequestCapital = true, owns50PercentOrMore = true } =
    options || {};

  if (authorizedToRequestCapital) {
    cy.get('[data-cy="authorized-to-request-capital-yes"]').click();
    if (owns50PercentOrMore) {
      cy.get('[data-cy="owns-50-percent-or-more-yes"]').click();
    } else {
      cy.get('[data-cy="owns-50-percent-or-more-no"]').click();
    }
  } else {
    cy.get('[data-cy="authorized-to-request-capital-no"]').click();
  }
};

declare global {
  namespace Cypress {
    interface Chainable {
      fillBusinessOwnerStep: typeof fillBusinessOwnerStep;
    }
  }
}

Cypress.Commands.add('fillBusinessOwnerStep', fillBusinessOwnerStep);
