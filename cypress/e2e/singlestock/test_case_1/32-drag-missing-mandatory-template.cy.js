describe('Step 32: Drag Missing Mandatory Template Error Test', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Drag portfolio Template', () => {
    const fileName = 'Single_stock_error_missing_mandatory.xlsx';
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
    // "Mandatory field OrderQty is missing for symbol 0700.HK!"
    cy.get('[role="presentation"]')
      .contains('p', 'Mandatory field OrderQty is missing for symbol 0700.HK!')
      .should('exist')

  });

})
