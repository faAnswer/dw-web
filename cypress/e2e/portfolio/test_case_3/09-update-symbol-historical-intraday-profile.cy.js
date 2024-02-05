//09-update-symbol-historical-intraday-profile.cy.js

describe('Step 9: Update Symbol Historical Intraday Profile Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()

  });



  it('Step 9: Update Symbol Historical Intraday Profile Test', () => {
    
    let oldId;

    //Step 9: Change stock picker seletion from 066570.KS to 0700.HK   in Historical Intraday Profile
    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#historical-intraday-title')
      .parent()
      .parent()
      .contains('div', '066570.KS')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', '0700.HK')
      .click()

    //1. the first bar of Estiamted Shares and Culmulative % is updated (e.g. 12:45)
    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).not.equal(oldId);

    })

  })
})