describe('Step 15: Click Export Portfolio And Trade Detail And Select Excel Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()
  });

  it('Click Export Portfolio And Trade Detail And Select Excel Test', () => {

    //1. 1. Excel with tabs "Summary", "Trade Details", "[stock code]", "Chart" and "Chart Data" will be downloaded
    cy.get('.action-bar-wrapper')
      .contains('div', 'Export')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Excel')
      .click()

    cy.get('[role="presentation"]')
      .contains('span', 'Portfolio and Trade Detail')
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
