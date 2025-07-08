export const fillBusinessSearchStep = (
  options: { businessName?: string; skipSearch?: boolean } = {}
) => {
  const { businessName = 'Runaso', skipSearch = true } = options;

  // Wait for the page to load and the form to be visible
  cy.wait(1000);

  if (skipSearch) {
    // Use a more flexible selector to find the button
    cy.contains('button', /continue without registry verification/i).click();
  } else {
    // Type business name in search field
    cy.get('input[id="businessSearch"]').type(businessName);

    // Click search button
    cy.contains('button', 'Search').click();

    // Wait for search results
    cy.wait(2000);

    // Check if results are found
    cy.get('body').then(($body) => {
      if ($body.text().includes('No businesses found')) {
        // No results found, continue without verification
        cy.contains(
          'button',
          /continue without registry verification/i
        ).click();
      } else {
        // Results found, click on first result
        cy.get('div[class*="border"][class*="hover:border-blue-300"]')
          .first()
          .click();

        // Wait for confirmation screen
        cy.wait(500);

        // Click "Yes, This is My Business" on confirmation screen
        cy.contains('button', /yes.*this is my business/i).click();
      }
    });
  }
};

declare global {
  namespace Cypress {
    interface Chainable {
      fillBusinessSearchStep: typeof fillBusinessSearchStep;
    }
  }
}

Cypress.Commands.add('fillBusinessSearchStep', fillBusinessSearchStep);
