describe('Step 33: Drag Optimized Parzmeter With Additional Template Error Test', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Drag portfolio Template', () => {
    const fileName = 'Single_stock_error_optimized_parameter_with_additional.xlsx';
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
    // "Side is missing for symbol 0700.HK! (OrdType, Side and Strategy are required for Optimized Parameters.)"
    cy.get('[role="presentation"]')
      .contains('p', 'Side is missing for symbol 0700.HK! (OrdType, Side and Strategy are required for Optimized Parameters.)')
      .should('exist')

    //Error Message is shown on the screen
    // "OrdType is missing for symbol 0700.HK! (OrdType, Side and Strategy are required for Optimized Parameters.)"
    cy.get('[role="presentation"]')
      .contains('p', 'OrdType is missing for symbol 0700.HK! (OrdType, Side and Strategy are required for Optimized Parameters.)')
      .should('exist')

    //Error Message is shown on the screen
    // "Strategy is missing for symbol 0700.HK! (OrdType, Side and Strategy are required for Optimized Parameters.)"
    cy.get('[role="presentation"]')
      .contains('p', 'Strategy is missing for symbol 0700.HK! (OrdType, Side and Strategy are required for Optimized Parameters.)')
      .should('exist')

  });

})
