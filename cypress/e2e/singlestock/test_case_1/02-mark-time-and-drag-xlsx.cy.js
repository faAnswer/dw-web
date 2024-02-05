const moment = require('moment')


describe('Step 2: Drag Valid Excel Template Test', () => {

  beforeEach(() => {

    cy.login();
    cy.dragExcel()
  });
  
  it('Mark the Current Time and Drag the Excel Template "Single_stock_template_with_params_20230329.xlsx" into the upload box', () => {

    const currentMoment = moment()
    const current = currentMoment.format("HH:mm")

    //1. Input Field is filled
    cy.get('#ric-input').should('have.value', '0700.HK');
    cy.get('#qty-input').should('have.value', '4,000,000');
    cy.get('#side-picker').should('have.text', 'BUY');
    cy.get('#strategy-picker').should('have.text', 'VWAP');
    cy.get('#order-type-picker').should('have.text', 'LIMIT');
    cy.get('[placeholder="Limit Price"]').should('have.value', '350.23');

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

    //**** Step 2.1 ****//
    //**** Click the "ADDITIONAL PARAMETER" Button ****//
    cy.get('#addition-params-btn').click();

    //1. Empty Input in the first line
    cy.get('.selector-wrapper').contains('span.notranslate', '\u200B').should('exist');

    //2. Showing additional parameter value
    cy.get('.form-dialog-title-container').contains('div', 'Additional Parameter').should('exist');

    //2.1. AggressiveFVOption: NOT_CROSS_IF_NOT_FALLING_BEHIND
    cy.get('.table-row-container')
      .find('[aria-label="0: If far price is further than FV, then don\'t cross; 1: If cumulative qty is more than behindFinal, then don\'t cross; default is 0; 2: cross regardless of FV"]')
      .siblings('.categorical-input-field')
      .find('.MuiInput-input')
      .should('have.text', 'NOT_CROSS_IF_NOT_FALLING_BEHIND');

    //2.2. ArrivalScalerCap: 3.72
    cy.get('.table-row-container')
      .find('[aria-label="cap on ArrivalScaler"]')
      .siblings('.additional-table-form-value')
      .find('.MuiInput-input')
      .should('have.value', '3.72');

    cy.contains('button', 'Confirm').click();
  })
})
