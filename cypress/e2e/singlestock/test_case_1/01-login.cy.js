describe('Step 1: Login Test', () => {

  it('Login with username and password', () => {

    cy.viewport(1600, 800)
    const apiUrl = Cypress.env('WEB_NEXT_URL');

    cy.visit(apiUrl + 'login')

    // 2. No saved profile will be shown on top right corner
    cy.get('.profile-container').should('not.exist');

    // 3. All Input Fields are empty
    cy.get('#user-id-input').should('have.value', '');
    cy.get('#password-input').should('have.value', '');


    cy.get('#user-id-input').type(Cypress.env('USERNAME'));
    cy.get('#password-input').type(Cypress.env('PASSWORD'));
    cy.get('#submit-btn').click();

    // 1. Logged in to the system
    cy.url().should('include', '/dashboard');
    
  });
});
