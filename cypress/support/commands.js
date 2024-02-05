// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-file-upload';

Cypress.Commands.add('login', () => {

  cy.task('clearUser', Cypress.env('USERNAME')).then(() => {

    cy.viewport(1600, 800)

    const apiUrl = Cypress.env('WEB_NEXT_URL');

    const visitWithRetry = (retries) => {

      cy.request({url: apiUrl + 'login', failOnStatusCode: false}).then((res) => {

        if (res.status === 200){

          cy.visit(apiUrl + 'login', { timeout: 30000 });
          cy.get('#user-id-input').clear().type(Cypress.env('USERNAME'));
          cy.get('#password-input').clear().type(Cypress.env('PASSWORD'));
          cy.get('#submit-btn').click();

          return
        }

        cy.task('log', 'Waiting for HTTP server ready (Retry after 30 seconds...)')

        cy.wait(30000)

        visitWithRetry(retries - 1);

      })
    }
    visitWithRetry(60)
  })
});



Cypress.Commands.add('dragExcel', () => {

  const fileName = 'Single_stock_template_with_params_20230329.xlsx';
  cy.fixture(fileName, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then((fileContent) => {
      cy.get('#drop-zone')
        .attachFile({
          fileContent,
          fileName,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          encoding: 'utf-8',
        });
    });

  cy.wait(500)
})
Cypress.Commands.add('dragPortfolioExcel', () => {

  const fileName = 'Portfolio_template_with_params_20230414.xlsx';
  cy.fixture(fileName, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then((fileContent) => {
      cy.get('#drop-zone')
        .attachFile({
          fileContent,
          fileName,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          encoding: 'utf-8',
        });
    });

  cy.wait(500)
})
Cypress.Commands.add('fillInput', () => {

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

  if(symbol.ORDER_TYPE === 'LIMIT'){

    //Limit Price
    cy.get('.optimized-params-form-wrapper')
      .find('input[placeholder="Limit Price"]')
      .clear()
      .type(symbol.LIMIT_PRICE)

  }

  //And then click "Run" Button
  cy.get('#single-stock-run-btn')
    .click()
})

Cypress.Commands.add('fillInput_case2', () => {

  const symbol = Cypress.env('SYMBOL_CASE_2')

  //Reuters Symbol
  cy.get('#ric-input').clear().type(symbol.SYMBOL);

  //Quantity
  cy.get('#qty-input').clear().type(symbol.QUANTITY);

  //Side: Buy
  cy.get('#side-picker')
    .click();

  cy.get('[role="presentation"]')
    .contains('li', symbol.SIDE)
    .click()

  //Strategy
  cy.get('#strategy-picker')
    .click()

  cy.get('[role="presentation"]')
    .contains('li', symbol.STRATEGY)
    .click()

  //Order Type
  cy.get('#order-type-picker')
    .click()

  cy.get('[role="presentation"]')
    .contains('li', symbol.ORDER_TYPE)
    .click()

  if(symbol.ORDER_TYPE === 'LIMIT'){

    //Limit Price
    cy.get('.optimized-params-form-wrapper')
      .find('input[placeholder="Limit Price"]')
      .clear()
      .type(symbol.LIMIT_PRICE)

  }

  //And then click "Run" Button
  cy.get('#single-stock-run-btn')
    .click()
})
