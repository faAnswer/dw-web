describe('Step 16: Click Export And Select Excel Test', () => {

  beforeEach(() => {

    cy.login()
    cy.fillInput()

    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('error');
    });
  });

  it('Click export and select Excel', () => {

    //1. Excel with tabs "[stock code]", "Chart" and "Chart Data" will be downloaded
    cy.get('.action-bar-wrapper')
      .contains('div', 'Export')
      .click()

    cy.get('@error').then((errorSpy) => {
      errorSpy.resetHistory();
    });
    
    cy.get('[role="presentation"]')
      .contains('li', 'Excel')
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
