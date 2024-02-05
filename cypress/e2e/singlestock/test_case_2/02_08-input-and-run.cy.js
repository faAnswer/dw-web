const moment = require('moment')

describe('Step 2 - 8: Input And Run Test', () => {

  beforeEach(() => {

    // cy.task('clearUser', Cypress.env('ACCOUNT'));
    cy.login();
  });

  it('Step 2 - 8: Input And Run', () => {

    // Step 2: Mark the Current Time (e.g. 11:30) and Input the specific Value
    const currentMoment = moment()
    const current = currentMoment.format("HH:mm")

    const symbol = Cypress.env('SYMBOL_CASE_1')


    //Reuters Symbol: 0700.hk
    cy.get('#ric-input').clear().type(symbol.SYMBOL);

    //Quantity:2,000,000
    cy.get('#qty-input').clear().type(symbol.QUANTITY);

    //Side: Buy
    cy.get('#side-picker')
      .click();

    cy.get('[role="presentation"]')
      .contains('li', symbol.SIDE)
      .click()

    //Strategy: VWAP
    cy.get('#strategy-picker')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', symbol.STRATEGY)
      .click()

    //Order Type: Limit
    cy.get('#order-type-picker')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', symbol.ORDER_TYPE)
      .click()

    //Limit Price: 350.23
    cy.get('.optimized-params-form-wrapper')
      .find('input[placeholder="Limit Price"]')
      .clear()
      .type(symbol.LIMIT_PRICE)

    //And then click "Run" Button
    cy.get('#single-stock-run-btn')
      .click()

    //1. Input Field is filled
    cy.get('#ric-input').should('have.value', symbol.SYMBOL);
    cy.get('#qty-input').should('have.value', symbol.QUANTITY);
    cy.get('#side-picker').should('have.text', symbol.SIDE);
    cy.get('#strategy-picker').should('have.text', symbol.STRATEGY);
    cy.get('#order-type-picker').should('have.text', symbol.ORDER_TYPE);
    cy.get('[placeholder="Limit Price"]').should('have.value', symbol.LIMIT_PRICE);

    //2. Instrument Characteristics is shown on the screen
    cy.get('#instrument-characteristics-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //3. Hitorical Intraday Profiles is shown on the screen
    cy.get('#historical-intraday-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //4. Optimized Parameters is shown on the screen
    cy.get('#optimized-parameters-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //5. Trade Schedule Estimate is shown on the screen
    cy.get('#trade-schedule-estimate-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

    //5.1. Value of Local Exchange Time [start Time] is sane as Marked Current Time
    cy.get('.time-picker-container')
      .find('input')
      .filter((_, elem) => {

        const currentAddOneMinute = currentMoment.add(1, 'minutes').format("HH:mm")

        const value = elem.value;

        return value === current || value === currentAddOneMinute;
      }).should('exist');
    //6. Optimized Parameters is shown on the screen
    // same as 4

    // Step 3: Click the "ADDITIONAL PARAMETER" Button  and Input the specific value
    cy.get('#addition-params-btn').click();

    // Set AggressiveFVOption: NOT_CROSS_IF_NOT_FALLING_BEHIND
    cy.get('.selector-wrapper')
      .find('div[role="button"]')
      .click();

    cy.get('[role="presentation"]')
      .find('li[data-value="AggressiveFVOption"]')
      .click();

    cy.get('[role="presentation"]')
      .find('.init-input-wrapper')
      .find('div[role="button"]')
      .click();

    cy.get('[role="presentation"]')
      .contains('li','NOT_CROSS_IF_NOT_FALLING_BEHIND')
      .click();

    cy.get('[role="presentation"]')
      .find('svg[data-testid="AddIcon"]')
      .click();

    cy.get('.table-row-container')
      .find('[aria-label="0: If far price is further than FV, then don\'t cross; 1: If cumulative qty is more than behindFinal, then don\'t cross; default is 0; 2: cross regardless of FV"]')
      .siblings('.categorical-input-field')
      .find('.MuiInput-input')
      .should('have.text', 'NOT_CROSS_IF_NOT_FALLING_BEHIND');

    // Set ArrivalScalerCap: 3.72
    cy.get('.selector-wrapper')
      .find('div[role="button"]')
      .click();

    cy.get('[role="presentation"]')
      .find('li[data-value="ArrivalScalerCap"]')
      .click();

    cy.get('[role="presentation"]')
      .find('.init-input-wrapper')
      .find('input')
      .clear()
      .type('3.72')

    cy.get('[role="presentation"]')
      .find('svg[data-testid="AddIcon"]')
      .click();

    cy.get('[role="presentation"]')
      .find('.submit-button-wrapper')
      .contains('button', 'Confirm')
      .click();

    cy.get('#addition-params-btn').click();

    //1. Empty Input in the first line
    cy.get('.selector-wrapper').contains('span.notranslate', '\u200B').should('exist');

    // 2. Showing additional parameter value
    cy.get('[role="presentation"]')
      .find('div[class="form-dialog-title-container"]')
      .find('div')
      .should('have.text', 'Additional Parameter')

    // 2.1. AggressiveFVOption: NOT_CROSS_IF_NOT_FALLING_BEHIND
    cy.get('.table-row-container')
      .find('[aria-label="0: If far price is further than FV, then don\'t cross; 1: If cumulative qty is more than behindFinal, then don\'t cross; default is 0; 2: cross regardless of FV"]')
      .siblings('.categorical-input-field')
      .find('.MuiInput-input')
      .should('have.text', 'NOT_CROSS_IF_NOT_FALLING_BEHIND');

    // 2.2. ArrivalScalerCap: 3.72
    cy.get('.table-row-container')
      .find('[aria-label="cap on ArrivalScaler"]')
      .siblings('.additional-table-form-value')
      .find('.MuiInput-input')
      .should('have.value', '3.72');


    // Step 4: Close the "ADDITIONAL PARAMETER" popup and click "CLIENT CONFIG SETTINGS" Input the specific value
    cy.get('[role="presentation"]')
      .find('.submit-button-wrapper')
      .contains('button', 'Confirm')
      .click();

    cy.get('#client-config-btn').click();

    cy.get('[role="presentation"]')
      .find('.CustomerId-picker-container')
      .find('div[role="button"]')
      .click();

    cy.get('[role="presentation"]')
      .find('li[data-value="BDI"]')
      .click();

    cy.get('[role="presentation"]')
      .find('.field-table-container')
      .find('input[placeholder="Text"]')
      .clear()
      .type('Client text')

    cy.get('[role="presentation"]')
      .find('.field-table-container')
      .find('input[placeholder="SpectrumUrgency"]')
      .clear()
      .type('client')

    cy.get('[role="presentation"]')
      .find('.submit-button-wrapper')
      .contains('button', 'Confirm')
      .click();


    // 1. Showing Client Config Settings Value
    cy.get('#client-config-btn').click();


    cy.get('[role="presentation"]')
      .find('.form-dialog-title-container')
      .find('div')
      .should('have.text', 'Client Config Settings')

    // 1.1. CustomerID: BDI
    cy.get('[role="presentation"]')
      .find('.CustomerId-picker-container')
      .find('div[role="button"]')
      .should('have.text', 'BDI')

    // 1.2. Text: Client text
    cy.get('[role="presentation"]')
      .find('.field-table-container')
      .find('input[placeholder="Text"]')
      .should('have.value', 'Client text')

    // 1.3. SpectrumUrgency: client
    cy.get('[role="presentation"]')
      .find('.field-table-container')
      .find('input[placeholder="SpectrumUrgency"]')
      .should('have.value', 'client')

    // Step 5: Click the "Clear"  Button
    cy.get('[role="presentation"]')
      .find('.submit-button-wrapper')
      .contains('button', 'Confirm')
      .click();

    cy.get('#single-stock-clear-btn')
      .click()

    //1. Input Field is filled

    // 1.1 Reuters Symbol
    cy.get('#ric-input').should('have.value', '');

    // 1.2 Quantity
    cy.get('#qty-input').should('have.value', '');

    // 1.3 Side
    cy.get('#side-picker').find('span[class="notranslate"]').should('exist');

    // 1.4 Strategy
    cy.get('#strategy-picker').find('span[class="notranslate"]').should('exist');

    // 1.5 Order Type
    cy.get('#order-type-picker').find('span[class="notranslate"]').should('exist');

    // Step 6: Click the "ADDITIONAL PARAMETER" Button
    cy.get('#addition-params-btn').click();

    // 1. Empty Input in the first line
    cy.get('.selector-wrapper').contains('span.notranslate', '\u200B').should('exist');

    // 2. No additional parameter value in the table
    cy.get('[role="presentation"]')
      .find('.table-body-container')
      .children()
      .should('have.length', 0);

    // Step 7: Close the "ADDITIONAL PARAMETER" popup and click "CLIENT CONFIG SETTINGS"
    cy.get('[role="presentation"]')
      .find('.submit-button-wrapper')
      .contains('button', 'Confirm')
      .click();

    cy.get('#client-config-btn').click();

    //1. 1. All Input Box is empty
    // 1.1 CustomerID
    cy.get('[role="presentation"]')
      .find('.CustomerId-picker-container')
      .find('div[role="button"]')
      .find('span[class="notranslate"]').should('exist');

    //1.2. Text: Client text
    cy.get('.field-table-container').find('input').eq(0).should('have.value', '');


    //1.3. client SpectrumUrgency
    cy.get('.field-table-container').find('input').eq(1).should('have.value', '');

    // Step 8: Close the "CLIENT CONFIG SETTINGS" popup
    cy.get('[role="presentation"]')
      .find('.submit-button-wrapper')
      .find('button')
      .click()
  })
})
