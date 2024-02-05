const moment = require('moment');

describe('Step 5: Update Time Trade Schedule Estimate Test', () => {

  beforeEach(() => {

    cy.login();
    cy.dragExcel()
  });

  it('Update the Start Time to Marked Current Time + 1 hours (e.g. 12:30) in Trade Schedule Estimate', () => {

    const newTime = moment().add(1,'hour').format('HH:mm');

    let oldId;

    //1. the first bar of Estiamted Shares and Culmulative % is updated (e.g. 12:45)
    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('.time-picker-container')
      .find('input')
      .then(($element) => {
        cy.wrap($element).invoke('attr', 'readonly').then((readonlyAttr) => {
          if (readonlyAttr) {

            cy.get('.time-picker-container').find('input').click();
            cy.get('button[type="button"]').filter('[aria-label="clock view is open, go to text input view"]').click();
            cy.get('.css-epd502').find('input').clear().type(newTime)
            cy.get('button[type="button"]').filter(':contains("OK")').click();

          } else {
            cy.wrap($element)
              .clear()
              .type(newTime);
          }
        });
      });

    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).not.equal(oldId);

    })
  })


})
