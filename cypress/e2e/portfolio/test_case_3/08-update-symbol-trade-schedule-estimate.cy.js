describe('Step 8: Update Symbol Trade Schedule Estimate Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()

  });



  it('Step 8: Update Symbol Trade Schedule Estimate Test', () => {

    //Step 8: Change stock picker seletion from 066570.KS to 0700.HK  in Trade Schedule Estimate
    let oldId;

    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#trade-schedule-estimate-title')
      .parent()
      .parent()
      .contains('div', '066570.KS')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', '0700.HK')
      .click()

    //1. the first bar of Estiamted Shares and Culmulative % is updated (e.g. 12:45)
    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).not.equal(oldId);

    })
  })
})