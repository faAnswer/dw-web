
describe('Step 17: Click Save Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()
  });

  it('Click Save Test', () => {

    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save')
      .click()

    //1. Save Profile Popup is shown on the screen
    cy.get('[role="presentation"]')
      .contains('div', 'Save Profile')
      .should('exist')

    
  })
})