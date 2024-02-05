describe('Step 35: Drag portfolio Missing Mandatory Template Error Test', () => {
  beforeEach(() => {
    cy.login();
    cy.get('#portfolio-tab').click();

  });

  it('Step 35: Drag portfolio Missing Mandatory Template Error Test', () => {
    const fileName = 'Portfolio_error_missing_mandatory.xlsx';
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
    // Mandatory field Symbol is missing for row 4!
    cy.get('[role="presentation"]')
      .contains('p', 'Mandatory field Symbol is missing for row 4!')
      .should('exist')

  });

})
