const moment = require('moment');

describe('Step 4: Update Day Trade Schedule Estimate Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()
  });

  it('Update the Day from Day1 to Day2 in Trade Shcedule Estiamte', () => {

    let oldId;

    //1. the first bar of Estiamted Shares and Culmulative % is updated (e.g. 12:45)
    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#trade-schedule-estimate-title')
      .siblings('.checkbox-wrapper')
      .contains('div', 'Day1')
      .click()

    cy.get('#menu-').contains('li', 'Day2').click()

    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).not.equal(oldId);

    })
  })


})