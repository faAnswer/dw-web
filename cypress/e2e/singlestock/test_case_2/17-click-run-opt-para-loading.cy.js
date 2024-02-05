describe('Step 17: Click Run And Optimized Parameters Loading Is Existed', () => {

  beforeEach(() => {

    cy.login()
    cy.dragExcel()

  });

  it('Change the symbol and click run', () => {

    //1. Ensure the data grid is loaded
    cy.get('#instrument-characteristics-title')
      .should('exist')

    cy.get('#trade-schedule-estimate-title')
      .should('exist')

    cy.get('#historical-intraday-title')
      .should('exist')

    cy.get('#optimized-parameters-title')
      .should('exist')

    //2. Change the symbol to 'MockA'
    //3. Click "Run" Button
    cy.fillInput_case2()


    //4. The "Optimized Parameters" is loading
    cy.get('#instrument-characteristics-title')
      .should('exist')

    cy.get('#trade-schedule-estimate-title')
      .should('exist')

    cy.get('#historical-intraday-title')
      .should('exist')

    cy.get('#optimized-parameters-title')
      .should('not.exist')
      .then(() => {

        cy.get('.grid-view')
          .find('.react-grid-layout')
          .find('.react-grid-item')
          .find('.grid-loading')
          .should('exist')
      })
  })
})
