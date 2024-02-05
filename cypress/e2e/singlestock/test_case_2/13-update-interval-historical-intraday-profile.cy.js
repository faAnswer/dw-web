describe('Step 13: Update Interval Local Exchange Test', () => {

  beforeEach(() => {

    cy.login();
    cy.fillInput()

    cy.get('#historical-intraday-title')
      .siblings('.historical-intraday-profiles')
      .find('.button-wrapper')
      .find('button[type="button"]')
      .filter(':contains("Volatility")')
      .click()
  });



  it('Update the Interval from 15 mins to 30 mins in Historical Intraday Profiles', () => {

    let oldId;

    //1. the first bar of VOLAILITY (bps) is updated to 09:30 from 09:15
    cy.get('#apexchartsbasic-bar')
      .find('svg')
      .find('.apexcharts-xaxis')
      .find('.apexcharts-xaxis-texts-g')
      .find('text')
      .eq(0)
      .find('title')
      .should('has.text', "09:15")
    
    //2. the Interval in the graph is updated to 30 mins
    cy.get('#historical-intraday-title')
      .siblings('.historical-intraday-profiles')
      .contains('span',"30 mins")
      .click()

    cy.get('#apexchartsbasic-bar')
      .find('svg')
      .find('.apexcharts-xaxis')
      .find('.apexcharts-xaxis-texts-g')
      .find('text')
      .eq(0)
      .find('title')
      .should('has.text', "09:30")
  })
})
