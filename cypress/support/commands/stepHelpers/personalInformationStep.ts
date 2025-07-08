export const fillPersonalInformationStep = (
  options: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    addressLine1?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  } = {}
) => {
  const {
    firstName = 'John',
    lastName = 'Doe',
    email = 'john.doe@example.com',
    phone = '1234567890',
    dateOfBirth = '1990-01-01',
    addressLine1 = '123 Main St',
    city = 'Toronto',
    province = 'Ontario',
    postalCode = 'M5V 2N1',
  } = options;

  cy.get('input[id="firstName"]').type(firstName);
  cy.get('input[id="lastName"]').type(lastName);
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="phone"]').type(phone);
  cy.get('input[id="dateOfBirth"]').type(dateOfBirth);
  cy.get('input[id="addressAutocompleteInput"]').type(addressLine1);
  cy.get('input[id="city"]').type(city);
  cy.get('input[id="province"]').type(province);
  cy.get('input[id="postalCode"]').type(postalCode);

  cy.get('button[type="submit"]').click();
};

declare global {
  namespace Cypress {
    interface Chainable {
      fillPersonalInformationStep: typeof fillPersonalInformationStep;
    }
  }
}

Cypress.Commands.add(
  'fillPersonalInformationStep',
  fillPersonalInformationStep
);
