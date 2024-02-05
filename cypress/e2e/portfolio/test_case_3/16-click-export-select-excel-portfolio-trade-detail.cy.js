describe('Step 16: Click Export Trade Detail And Select Excel Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()
  });

  it('Click Export Trade Detail And Select Excel Test', () => {

    //1. Excel with tabs "Trade Details" will be downloaded
    cy.get('.action-bar-wrapper')
      .contains('div', 'Export')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Excel')
      .click()

    cy.get('[role="presentation"]')
      .contains('span', 'Trade Detail')
      .click()

    cy.intercept('/excel-chart-file').as('fileDownload');


    cy.get('[role="presentation"]')
      .contains('button', 'Confirm')
      .click()

    cy.wait('@fileDownload').then((interception) => {

      expect(interception.response.statusCode).to.eq(200);
      
    });

    
  })
})
