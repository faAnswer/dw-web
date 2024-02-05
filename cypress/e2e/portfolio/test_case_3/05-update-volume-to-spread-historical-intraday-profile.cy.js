describe('Step 5: Update VOLUME to SPREAD Local Exchange Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()
  });

  it('Updated the Local Exchange Time from VOLUME to SPREAD in Historical Intraday Profile', () => {

    //1. the graph is updated from "% of Day Volume" to "Spread (bps)"
    let oldId;

    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#historical-intraday-title')
      .siblings('.historical-intraday-profiles')
      .find('.button-wrapper')
      .find('button[type="button"]')
      .filter(':contains("Spread")')
      .click()

    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).not.equal(oldId);
    })

  })

})