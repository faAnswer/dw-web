const moment = require('moment')


describe('Step 1: Drag Valid Excel Template Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()
  });
  
  it('Mark the Current Time and Drag the Excel Template "Portfolio_template_with_params_20230414.xlsx" into the upload box', () => {

    const currentMoment = moment()
    const current = currentMoment.format("HH:mm")
    //1. Yellow round button with excel file name is shown below the upload excel Section

    cy.get('.portfolio-upload-csv-result-container')
      .get('.inner-container')
      .contains('div', 'Portfolio_template_with_params_20230414.xlsx')
      .should('exist')

    // 2. Portfolio Summary is shown on the screen
    cy.get('#portfolio-summary-title')
      .parent()
      .parent()
      .should('not.has.class', 'hidden')

    // 3. Hitorical Intraday Profiles is shown on the screen
    cy.get('#historical-intraday-title')
      .parent()
      .parent()
      .should('not.has.class', 'hidden')

    // 4. Optimized Parameters is shown on the screen
    cy.get('#optimized-parameters-title')
      .parent()
      .parent()
      .should('not.has.class', 'hidden')

    // 5. Trade Schedule Estimate is shown on the screen
    cy.get('#trade-schedule-estimate-title')
      .parent()
      .parent()
      .should('not.has.class', 'hidden')

    // 5.1. Value of Local Exchange Time [start Time] is sane as Marked Current Time
    cy.get('.time-picker-container')
      .find('input')
      .filter((_, elem) => {

        const currentAddOneMinute = currentMoment.add(1, 'minutes').format("HH:mm")
        
        const value = elem.value;

        return value === current || value === currentAddOneMinute;
      }).should('exist');

    // 6. Portfolio Breakdown is shown on the screen
    cy.get('#portfolio-breakdown-title')
      .parent()
      .parent()
      .should('not.has.class', 'hidden')


  })
})
