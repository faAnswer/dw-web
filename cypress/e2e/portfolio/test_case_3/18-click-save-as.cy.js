
describe('Step 18: Click Save As Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()
  });

  it('Click Save As Test', () => {

    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save as')
      .click()

    //1. Save Profile Popup is shown on the screen
    cy.get('[role="presentation"]')
      .contains('div', 'Save Profile')
      .should('exist')

    
  })
})