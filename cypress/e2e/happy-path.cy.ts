describe('Happy Path', () => {
  it('should navigate to the form, fill the first and last name, and submit', () => {
    cy.visit('/');
    cy.contains('Apply Now').click();

    cy.assertNavigatedToStep('loan-type');
    cy.fillLoanTypeStep();

    cy.assertNavigatedToStep('personal-information');
    cy.get('input[id="firstName"]').type('John');
    cy.get('input[id="lastName"]').type('Doe');
  });
});
