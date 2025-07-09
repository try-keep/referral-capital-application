describe('Happy Path', () => {
  it('should be able to complete an application', () => {
    cy.visit('/step/1');

    cy.assertNavigatedToStep('loan-type');
    cy.fillLoanTypeStep();

    cy.assertNavigatedToStep('personal-information');
    cy.fillPersonalInformationStep();

    cy.assertNavigatedToStep('business-owner');
    cy.fillBusinessOwnerStep();

    cy.assertNavigatedToStep('business-search');
    cy.fillBusinessSearchStep();

    cy.assertNavigatedToStep('business-type');
    cy.fillBusinessTypeStep();

    cy.assertNavigatedToStep('monthly-sales');
    cy.fillMonthlySalesStep();

    cy.assertNavigatedToStep('existing-loans');
    cy.fillExistingLoansStep();
  });
});
