describe('Step 18: Click Run And Optimized Parameters Will Be Updated', () => {

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

    let oldPerformanceEstimate;

    cy.get('.grid-view-wrapper')
      .find('.react-grid-layout')
      .find('.react-grid-item')
      .find('.grid-content')
      .find('.optimized-parameters')
      .find('.performance-estimate-container')
      .find('.performance-estimate-value')
      .invoke('text')
      .then((text) => {

        oldPerformanceEstimate = text
      })

    //2. Change the symbol to 'MockA'
    //3. Click "Run" Button
    cy.fillInput_case2()

    //4. Waiting "Optimized Parameters"
    cy.get('#optimized-parameters-title', { timeout: 30000 })
      .should('exist')

    //5. "Optimized Parameters" is updated
    cy.get('.grid-view-wrapper')
      .find('.react-grid-layout')
      .find('.react-grid-item')
      .find('.grid-content')
      .find('.optimized-parameters')
      .find('.performance-estimate-container')
      .find('.performance-estimate-value')
      .invoke('text')
      .then((text) => {

        expect(text).to.not.equal(oldPerformanceEstimate)
      })
  })
})
