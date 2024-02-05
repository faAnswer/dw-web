describe('Step 31: Drag Invalid Template Error Test', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Drag portfolio Template', () => {
    const fileName = 'Single_stock_error_invalid_customerID.xlsx';
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
    // "Invalid CustomerId for symbol 0700.HK!"
    cy.get('[role="presentation"]')
      .contains('p', 'Invalid CustomerId for symbol 0700.HK!')
      .should('exist')

  });

})
