describe('Step 9: Update SPREAD to VOLAILITY  Local Exchange Test', () => {

  beforeEach(() => {

    cy.login();
    cy.dragExcel()

    cy.get('#historical-intraday-title')
      .siblings('.historical-intraday-profiles')
      .find('.button-wrapper')
      .find('button[type="button"]')
      .filter(':contains("Spread")')
      .click()
  });



  it('Updated the Local Exchange Time from SPREAD to VOLAILITY  in Historical Intraday Profile', () => {

    let oldId;

    // 1. the graph is updated from "Spread (bps)" to "Volaility (bps)"
    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#historical-intraday-title')
      .siblings('.historical-intraday-profiles')
      .find('.button-wrapper')
      .find('button[type="button"]')
      .filter(':contains("Volatility")')
      .click()

    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).not.equal(oldId);
    })
  })
})