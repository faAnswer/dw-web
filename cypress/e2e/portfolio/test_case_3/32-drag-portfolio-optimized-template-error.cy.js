describe('Step 32: Drag portfolio Optimized Template Error Test', () => {
  beforeEach(() => {
    cy.login();
    cy.get('#portfolio-tab').click();

  });

  it('Step 32: Drag portfolio Optimized Template Error Test', () => {
    const fileName = 'Portfolio_error_optimized_parameter.xlsx';
    cy.fixture(fileName, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('#drop-zone')
          .attachFile({
            fileContent,
            fileName,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            encoding: 'utf-8',
          });
      });

    //Error Message is shown on the screen
    // "Strategy is missing for symbol 2330.TW! (OrdType, Side and Strategy are required for Optimized Parameters.)"
    cy.get('[role="presentation"]')
      .contains('p', 'Strategy is missing for symbol 2330.TW! (OrdType, Side and Strategy are required for Optimized Parameters.)')
      .should('exist')

  });

})
