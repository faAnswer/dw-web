const moment = require('moment')

describe('Step 9 - 10: Input Without Optional Test', () => {

  beforeEach(() => {

    cy.login();
  });

  it('Step 9 - 10: Input Without Optional Test', () => {

    const symbol = Cypress.env('SYMBOL_CASE_1')


    // Step 9: Mark the Current Time (e.g. 12:00) and Input the below Value

    cy.get('#ric-input')
      .clear()
      .type(symbol.SYMBOL)

    cy.get('#qty-input')
      .clear()
      .type(symbol.QUANTITY)

    const currentMoment = moment()
    const currentTime = currentMoment.format('HH:mm')

    cy.get('#single-stock-run-btn')
      .click()

    //1. Input Field is filled
    // 1.1 Symbol: 0700.hk
    cy.get('#ric-input')
      .should('have.value', symbol.SYMBOL)

    // 1.2: Quantity:2,000,000
    cy.get('#qty-input')
      .should('have.value', symbol.QUANTITY)

    //2. Background of "Optional (Only required for Optimized Parameters)" is grey

    //3. Instrument Characteristics is shown on the screen
    cy.get('#instrument-characteristics-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //4. Historical Intraday Profiles is shown on the screen
    cy.get('#historical-intraday-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //5. Optimized Parameters is NOT shown on the screen
    cy.get('#optimized-parameters-title').should('not.exist')


    //6. Trade Schedule Estimate is shown on the screen
    cy.get('#trade-schedule-estimate-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    cy.get('.time-picker-container')
      .find('input')
      .filter((_, elem) => {

        const currentAddOneMinute = currentMoment.add(1, 'minutes').format("HH:mm")

        const value = elem.value;

        return value === currentTime || value === currentAddOneMinute;
      }).should('exist');

    // Step 10: Click the "Widget" Button
    cy.contains('div', 'Widget').click();

    //1. only 3 option is shown:
    cy.get('[role="presentation"]')
      .find('li')
      .should('have.length', 3);

    //Remove the Value of Quantity and click Run
    cy.get('.MuiBackdrop-root').click();
    cy.get('#qty-input')
      .clear()

    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#single-stock-run-btn')
      .click()

    //1. Warning message "Required" is shown under "Quantity" field
    cy.get('#qty-error-label')
      .should('exist')

    //2. the graph did not reload
    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).equal(oldId);
    })

    // Input the Value of "Quantity": "2,000,000" and remove the value of Reuters Symbol
    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#qty-input')
      .clear()
      .type('4,000,000')

    cy.get('#ric-input')
      .clear()

    //1. Warning message "Required" is shown under "Reuters Symbol" field
    cy.get('#ric-error-label')
      .should('exist')

    //2. the graph did not reload
    cy.get('#apexchartsbasic-bar').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).equal(oldId);
    })

    //Input the Value of "Reuter Symbol" : "0700.HK" and Enter  Value of "Side": "BUY"
    // And then Click "Run" Button
    cy.get('#ric-input')
      .clear()
      .type('0700.HK')

    cy.get('#side-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'BUY')
      .click()

    cy.get('#single-stock-run-btn')
      .click()

    //The error message 'Required' is displayed beneath the corresponding input text field.
    cy.get('.optimized-param-input-field-form')
      .find('.input-column-1')
      .find('.warning')
      .should('exist')

    cy.get('.optimized-param-input-field-form')
      .find('.input-column-2')
      .find('.warning')
      .should('exist')


    //Select Value of "Side": "NONE"
    // Select Value of "Strategy": "VWAP"
    // And then Click "Run" Button

    cy.get('#side-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'None')
      .click()

    cy.get('#strategy-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'VWAP')
      .click()

    cy.get('#single-stock-run-btn')
      .click()

    //The error message 'Required' is displayed beneath the corresponding input text field.
    cy.get('.optimized-param-input-field-form')
      .find('.input-column-1')
      .find('.warning')
      .should('have.length', 2);

    //Select Value of "Strategy": "NONE"
    // Select Value of "Order Type": "MARKET"
    // And then Click "Run" Button

    cy.get('#strategy-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'None')
      .click()

    cy.get('#order-type-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'MARKET')
      .click()

    cy.get('#single-stock-run-btn')
      .click()

    //The error message 'Required' is displayed beneath the corresponding input text field.
    cy.get('.optimized-param-input-field-form')
      .find('.input-column-2')
      .find('.warning')
      .should('exist')

    // Select Value of "Side": "Buy"
    // Select Value of "Strategy": "VWAP"
    // Select Value of "Order Type": "LIMIT"
    // And then Click "Run" Button
    cy.get('#side-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'BUY')
      .click()

    cy.get('#strategy-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'VWAP')
      .click()

    cy.get('#order-type-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'LIMIT')
      .click()

    cy.get('#single-stock-run-btn')
      .click()

    //The error message 'Required' is displayed beneath the corresponding input text field.
    cy.get('.optimized-param-input-field-form')
      .find('.input-column-1')
      .find('.warning')
      .should('exist')

    // Select Value of "Side": "Buy"
    // Select Value of "Strategy": "VWAP"
    // Select Value of "Order Type": "LIMIT"
    // Limit Price: 350.23
    // And then Click "Run" Button
    cy.get('#side-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'BUY')
      .click()

    cy.get('#strategy-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'VWAP')
      .click()

    cy.get('#order-type-picker').click()

    cy.get('[role="presentation"]')
      .contains('li', 'LIMIT')
      .click()

    cy.get('.optimized-param-section')
      .find('input[placeholder="Limit Price"]')
      .clear()
      .type('350.23')

    cy.get('#single-stock-run-btn')
      .click()

    //1. Instrument Characteristics is shown on the screen
    cy.get('#instrument-characteristics-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //2. Historical Intraday Profiles is shown on the screen
    cy.get('#historical-intraday-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //3. Optimized Parameters is  shown on the screen
    cy.get('#optimized-parameters-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //4. Trade Schedule Estimate is shown on the screen
    cy.get('#trade-schedule-estimate-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //Click the "Widget" Button
    cy.contains('div', 'Widget').click();

    //1.Four options are shown:
    cy.get('[role="presentation"]')
      .find('li')
      .should('have.length', 4);

    cy.get('.MuiBackdrop-root').click();

    const newTime = currentMoment.add(1, 'hour').format('HH:mm')

    let oldId;
    //Update the Start Time to Marked Current Time + 1 hours (e.g. 12:30) in Trade Schedule Estimate
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

    //Update the Interval from 15 mins to 30 mins in Trade Schedule Estiamte
    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#trade-schedule-estimate-title')
      .siblings('.checkbox-wrapper')
      .contains('span',"30 mins")
      .click()

    //1. the first bar of Estiamted Shares and Culmulative % is updated (e.g. 13:00)
    // 2. the Interval in the graph is updated to 30 mins
    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).not.equal(oldId);
    })

    //Update the Day from Day1 to Day2 in Trade Shcedule Estiamte
    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      oldId = id
    })

    cy.get('#trade-schedule-estimate-title')
      .siblings('.checkbox-wrapper')
      .contains('div', 'Day1')
      .click()

    cy.get('#menu-').contains('li', 'Day2').click()

    //1. the graph is updated in Trade Schedule Estiamte
    cy.get('#chart').find('svg').eq(0).invoke('attr', 'id').then((id)=>{

      expect(id).not.equal(oldId);

    })

  })
})
