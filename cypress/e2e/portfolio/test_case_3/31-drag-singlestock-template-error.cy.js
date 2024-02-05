describe('Step 31: Drag Signle Stock Template Error Test', () => {
  beforeEach(() => {
    cy.login();
    cy.get('#portfolio-tab').click();

  });

  it('Step 31: Drag Signle Stock Template Error Test', () => {
    const fileName = 'Single_stock_template_with_params_20230329.xlsx';
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
    // "Please upload input file in single stock page!"
    cy.get('[role="presentation"]')
      .contains('p', 'Please upload input file in single stock page!')
      .should('exist')

  });

})
