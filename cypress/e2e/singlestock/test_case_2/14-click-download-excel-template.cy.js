describe('Step 14: Click Download Excel Template Test', () => {

  beforeEach(() => {

    cy.login()
    cy.fillInput()
  });

  it('Click Download Excel Template', () => {

    cy.intercept('/excel-template/SINGLE_STOCK').as('fileDownload');

    cy.get('.single-stock-download-excel-wrapper').click();

    cy.wait('@fileDownload').then((interception) => {
      //1. Excel will be downloaded
      expect(interception.response.statusCode).to.eq(200);

    });
  })
})