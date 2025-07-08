Cypress.Commands.add('assertNavigatedToStep', (stepName: string) => {
  cy.get(`[data-cy="step-${stepName}"]`).should('exist').and('be.visible');
});
