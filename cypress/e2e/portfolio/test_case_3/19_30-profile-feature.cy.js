const moment = require('moment')

describe('Step 19 - 30: Profile Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()

    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save as')
      .click()
  });

  it('Step 19 - 30: Profile Test', () => {

    // Step 19: Enter the Profile Name "TC05-layout_with_data-[date]-[time]" (e.g. TC05_layout_with_data-20230329-1200)
    const profileNameTC05 = 'TC05-layout_with_data-' + moment().format('YYYYMMDD-HHmm')

    cy.get('[role="presentation"]')
      .find('.profile-dialog-input')
      .find('input')
      .clear()
      .type(profileNameTC05)

    cy.get('[role="presentation"]')
      .contains('span', 'Layout including input data')
      .click()

    cy.get('[role="presentation"]')
      .contains('button', 'Save')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    // 2. the Profile Name (TC05_layout_with_data-20230329-1200) is shown on the top right corner
    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC05)
      .should('exist')

    //Step 20: Drag the Excel Template "Portfolio_template_with_params_20230414_1.xlsx" into the upload box

    const fileName1 = 'Portfolio_template_with_params_20230414_1.xlsx';
    cy.fixture(fileName1, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('#drop-zone')
          .attachFile({
            fileContent,
            fileName: fileName1,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            encoding: 'utf-8',
          });
      });

    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('button', 'Confirm')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    //Step 21: Drag the Excel Template "Portfolio_template_with_params_20230414_2.xlsx" into the upload box
    const fileName2 = 'Portfolio_template_with_params_20230414_2.xlsx';
    cy.fixture(fileName2, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('#drop-zone')
          .attachFile({
            fileContent,
            fileName: fileName2,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            encoding: 'utf-8',
          });
      });

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Portfolio Summary')
      .click()

    cy.get('.MuiBackdrop-root').click()

    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save as')
      .click()

    //1. Save Profile Popup is shown on the screen
    cy.get('[role="presentation"]')
      .contains('div', 'Save Profile')
      .should('exist')

    //Step 22: Enter the Profile Name "TC06-layout_with_data-[date]-[time]"
    const profileNameTC06 = 'TC06-layout_with_data-' + moment().format('YYYYMMDD-HHmm')

    cy.get('[role="presentation"]')
      .find('.profile-dialog-input')
      .find('input')
      .clear()
      .type(profileNameTC06)

    cy.get('[role="presentation"]')
      .contains('span', 'Layout including input data')
      .click()

    cy.get('[role="presentation"]')
      .contains('button', 'Save')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    // 2. the Profile Name (TC06_layout_with_data-20230329-1200) is shown on the top right corner
    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC06)
      .should('exist')


    //Step 23: Drag the Excel Template "Portfolio_template_with_params_20230414_3.xlsx" into the upload box

    const fileName3 = 'Portfolio_template_with_params_20230414_3.xlsx';
    cy.fixture(fileName3, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('#drop-zone')
          .attachFile({
            fileContent,
            fileName: fileName3,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            encoding: 'utf-8',
          });
      });

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Optimized Parameters')
      .click()

    cy.get('.MuiBackdrop-root').click()

    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save as')
      .click()

    //1. Save Profile Popup is shown on the screen
    cy.get('[role="presentation"]')
      .contains('div', 'Save Profile')
      .should('exist')

    //Step 24: Enter the Profile Name "TC07-layout_with_data-[date]-[time]"
    const profileNameTC07 = 'TC07-layout_with_data-' + moment().format('YYYYMMDD-HHmm')

    cy.get('[role="presentation"]')
      .find('.profile-dialog-input')
      .find('input')
      .clear()
      .type(profileNameTC07)

    cy.get('[role="presentation"]')
      .contains('span', 'Layout including input data')
      .click()

    cy.get('[role="presentation"]')
      .contains('button', 'Save')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    // 2. the Profile Name (TC07_layout_with_data-20230329-1200) is shown on the top right corner
    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC07)
      .should('exist')

    //Step 25: Drag the Excel Template "Portfolio_template_with_params_20230414_4.xlsx" into the upload box
    const fileName4 = 'Portfolio_template_with_params_20230414_4.xlsx';

    cy.fixture(fileName4, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('#drop-zone')
          .attachFile({
            fileContent,
            fileName: fileName4,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            encoding: 'utf-8',
          });
      });

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Trade Schedule Estimate')
      .click()

    cy.get('.MuiBackdrop-root').click()

    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save as')
      .click()

    //Step 26: Enter the Profile Name "TC08-layout_with_data-[date]-[time]"
    const profileNameTC08 = 'TC08-layout_with_data-' + moment().format('YYYYMMDD-HHmm')

    cy.get('[role="presentation"]')
      .find('.profile-dialog-input')
      .find('input')
      .clear()
      .type(profileNameTC08)

    cy.get('[role="presentation"]')
      .contains('span', 'Layout including input data')
      .click()

    cy.get('[role="presentation"]')
      .contains('button', 'Save')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    // 2. the Profile Name (TC08_layout_with_data-20230329-1200) is shown on the top right corner
    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC08)
      .should('exist')

    //Step 27: Change the Profile from TC08 to TC05
    cy.get('.profile-name')
      .contains('div', profileNameTC08)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC05}"]`)
      .filter('[role="option"]')
      .click()

    //1. Yellow round button with excel filename "Portfolio_template_with_params_20230414_1.xlsx" is shown
    cy.get('.portfolio-upload-csv-result-container')
      .contains('div', 'Portfolio_template_with_params_20230414_1.xlsx')
      .should('exist')

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    //2. Portfolio Summary,
    // Portfolio Breakdown,
    // Historical Intraday Profiles,
    // Optimized Parameters, and Trade Schedule Estimate are turning On
    cy.get('[role="presentation"]')
      .contains('li', 'Historical Intraday Profiles')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Optimized Parameters')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Portfolio Breakdown')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Portfolio Summary')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Trade Schedule Estimate')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('.MuiBackdrop-root').click()


    //Step 28: Change the Profile from TC05 to TC06
    cy.get('.profile-name')
      .contains('div', profileNameTC05)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC06}"]`)
      .filter('[role="option"]')
      .click()

    //1. Yellow round button with excel filename "Portfolio_template_with_params_20230414_2.xlsx" is shown
    cy.get('.portfolio-upload-csv-result-container')
      .contains('div', 'Portfolio_template_with_params_20230414_2.xlsx')
      .should('exist')

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    //2. Portfolio Breakdown, Optimized Parameters, Historical Intraday Profiles, and Trade Schedule Estimate are turning On
    cy.get('[role="presentation"]')
      .contains('li', 'Historical Intraday Profiles')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Portfolio Breakdown')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Trade Schedule Estimate')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Optimized Parameters')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    // 3. Portfolio Summary  are turning Off
    cy.get('[role="presentation"]')
      .contains('li', 'Portfolio Summary')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')



    cy.get('.MuiBackdrop-root').click()

    //Step 29: Change the Profile from TC06 to TC07
    cy.get('.profile-name')
      .contains('div', profileNameTC06)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC07}"]`)
      .filter('[role="option"]')
      .click()

    //1. Yellow round button with excel filename "Portfolio_template_with_params_20230414_3.xlsx" is shown
    cy.get('.portfolio-upload-csv-result-container')
      .contains('div', 'Portfolio_template_with_params_20230414_3.xlsx')
      .should('exist')

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    //2. Portfolio Breakdown,
    // Historical Intraday Profiles,
    // Optimized Parameters, and Trade Schedule Estimate are turning On
    cy.get('[role="presentation"]')
      .contains('li', 'Historical Intraday Profiles')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Portfolio Breakdown')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Trade Schedule Estimate')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    //3. Portfolio Summary and Optimized Parameters are turning Off

    cy.get('[role="presentation"]')
      .contains('li', 'Optimized Parameters')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')


    cy.get('[role="presentation"]')
      .contains('li', 'Portfolio Summary')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')


    cy.get('.MuiBackdrop-root').click()

    //Step 30: Change the Profile from TC07 to TC08
    cy.get('.profile-name')
      .contains('div', profileNameTC07)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC08}"]`)
      .filter('[role="option"]')
      .click()

    //1. Yellow round button with excel filename "Portfolio_template_with_params_20230414_4.xlsx" is shown
    cy.get('.portfolio-upload-csv-result-container')
      .contains('div', 'Portfolio_template_with_params_20230414_4.xlsx')
      .should('exist')

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    //2. Portfolio Breakdown,
    // Historical Intraday Profiles are turning On
    cy.get('[role="presentation"]')
      .contains('li', 'Historical Intraday Profiles')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Portfolio Breakdown')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')


    // 3. Trade Schedule Estimate, Optimized Parameters and Portfolio Summary is turning Off
    cy.get('[role="presentation"]')
      .contains('li', 'Trade Schedule Estimate')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Optimized Parameters')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Portfolio Summary')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')

    cy.get('.MuiBackdrop-root').click()

  })
})