const moment = require('moment');

describe('Step 6: Update Interval Trade Schedule Estimate Test', () => {

  beforeEach(() => {

    cy.login();
    cy.dragExcel()
  });

  it('Update the Interval from 15 mins to 30 mins in Trade Schedule Estiamte', () => {

    let oldId;

    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#trade-schedule-estimate-title')
      .siblings('.checkbox-wrapper')
      .contains('span',"30 mins")
      .click()

    //1. the first bar of Estiamted Shares and Culmulative % is updated (e.g. 13:00)
    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).not.equal(oldId);
    })



  })


})