describe('Step 11: Click Export Portfolio And Select PDF Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()

    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('error');
    });
  });

  it('Click Export Portfolio And Select PDF', () => {

    //1. PDF with current screen will be downloaded

    cy.get('.action-bar-wrapper')
      .contains('div', 'Export')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'PDF')
      .click()

    cy.get('[role="presentation"]')
      .contains('span', 'Portfolio')
      .click()

    cy.get('@error').then((errorSpy) => {
      errorSpy.resetHistory();
    });

    cy.get('[role="presentation"]')
      .contains('button', 'Confirm')
      .click()

    cy.wait(10000);

    cy.get('@error').then((errorSpy) => {
      if (errorSpy.called) {
        console.error('Error(s) in console after clicking Confirm:', errorSpy.getCalls());
      }
    });

    // Ignore warning by react
    cy.get('@error').should((error) => {
      if (error.length > 0) {
        error.forEach((err) => {

          if (!err.args[0].includes('Warning: React does not recognize')) {
            throw new Error(`Unexpected error in console: ${err.args[0]}`);
          }
        });
      }
    });
  })
})
