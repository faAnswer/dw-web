describe('Step 28: Drag portfolio Template Error Test', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Drag portfolio Template', () => {
    const fileName = 'Portfolio_template_with_params_20230329.xlsx';
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
    // "Please upload input file in portfolio page!"
    cy.get('[role="presentation"]')
      .contains('p', 'Please upload input file in portfolio page!')
      .should('exist')

  });

})
