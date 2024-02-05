const moment = require('moment')

describe('Step 15 - 27: Profile Feature Test', () => {

  before(() => {

    cy.login()
    cy.dragExcel()
  });

  it('Step 15 - 27: Profile Feature Test', () => {

    // Step 15: Click save button and select save
    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save')
      .click()

    // 1. Save Profile Popup is shown on the screen
    cy.get('[role="presentation"]')
      .find('.form-dialog-title-container')
      .contains('div', 'Save Profile')
      .should('exist')


    //Step 16: Enter the TC01 Profile Name, select Layout Including input data and Save

    const profileNameTC01 = 'TC01-layout_with_data-' + moment().format('YYYYMMDD-HHmm')

    //Enter the Profile Name "TC01-layout_with_data-[date]-[time]" (e.g. TC01_layout_with_data-20230329-1200)
    cy.get('[role="presentation"]')
      .find('.profile-dialog-input')
      .find('input')
      .type(profileNameTC01);

    //select Layout Including input data
    cy.get('[role="presentation"]')
      .find('.radio-button-container')
      .contains('span', 'Layout including input data')
      .click()

    //select Layout Including input data
    cy.get('[role="presentation"]')
      .find('.button-wrapper')
      .contains('button', 'Save')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    //2. the Profile Name (TC01_layout_with_data-20230329-1200) is shown on the top right corner
    cy.get('.profile-name')
      .contains('div', profileNameTC01)
      .should('exist')

    //Step 17: Update the Quantity to 1,000,000 click Save Button and select Save
    cy.get('#qty-input').clear().type(1000000);

    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .find('.save-layout-dialog-container')
      .contains('button', 'Confirm')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    //Step 18:
    //Update the Quantity to 5,000,000 and Turn off the Historical Intraday Profile by clicking Widget
    //Click Save Button and select Save as

    //Update the Quantity to 5,000,000
    cy.get('#qty-input').clear().type(5000000);

    //Turn off the Historical Intraday Profile
    cy.get('#historical-intraday-title')
      .parent()
      .siblings('.close-btn')
      .click()

    //Click Save Button and select Save as
    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save as')
      .click()

    // 1. Save Profile Popup is shown on the screen
    cy.get('[role="presentation"]')
      .find('.form-dialog-title-container')
      .contains('div', 'Save Profile')
      .should('exist')

    //Step 19: Enter the TC02 Profile Name, select Layout Including input data and Save
    const profileNameTC02 = 'TC02-layout_with_data-' + moment().format('YYYYMMDD-HHmm')

    //Enter the Profile Name "TC02-layout_with_data-[date]-[time]" (e.g. TC02_layout_with_data-20230329-1200)
    cy.get('[role="presentation"]')
      .find('.profile-dialog-input')
      .find('input')
      .type(profileNameTC02);

    //select Layout Including input data
    cy.get('[role="presentation"]')
      .find('.radio-button-container')
      .contains('span', 'Layout including input data')
      .click()

    //select Layout Including input data
    cy.get('[role="presentation"]')
      .find('.button-wrapper')
      .contains('button', 'Save')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    //2. the Profile Name (TC02_layout_with_data-20230329-1200) is shown on the top right corner
    cy.get('.profile-name')
      .contains('div', profileNameTC02)
      .should('exist')

    //Step 20:
    //Update the Quantity to 100 and Turn off the Optimized Parameters Profile by clicking Widget
    //Click Save Button and select Save as

    //Update the Quantity to 100
    cy.get('#qty-input').clear().type(100);

    //Turn off the Historical Intraday Profile
    cy.get('#optimized-parameters-title')
      .parent()
      .siblings('.close-btn')
      .click()

    //Click Save Button and select Save as
    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save as')
      .click()

    // 1. Save Profile Popup is shown on the screen
    cy.get('[role="presentation"]')
      .find('.form-dialog-title-container')
      .contains('div', 'Save Profile')
      .should('exist')

    //Step 21: Enter the TC03 Profile Name, select Layout Including input data and Save
    const profileNameTC03 = 'TC03-layout_with_data-' + moment().format('YYYYMMDD-HHmm')

    //Enter the Profile Name "TC03-layout_with_data-[date]-[time]" (e.g. TC03_layout_with_data-20230329-1200)
    cy.get('[role="presentation"]')
      .find('.profile-dialog-input')
      .find('input')
      .type(profileNameTC03);

    //select Layout Including input data
    cy.get('[role="presentation"]')
      .find('.radio-button-container')
      .contains('span', 'Layout including input data')
      .click()

    //select Layout Including input data
    cy.get('[role="presentation"]')
      .find('.button-wrapper')
      .contains('button', 'Save')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    //2. the Profile Name (TC03_layout_with_data-20230329-1200) is shown on the top right corner
    cy.get('.profile-name')
      .contains('div', profileNameTC03)
      .should('exist')

    //Step 22:
    //Update the Quantity to 500 and Turn off the Trade Schedule Estimate by clicking Widget
    //Click Save Button and select Save as

    //Update the Quantity to 500
    cy.get('#qty-input').clear().type(500);

    //Turn off the Historical Intraday Profile
    cy.get('#trade-schedule-estimate-title')
      .parent()
      .siblings('.close-btn')
      .click()

    //Click Save Button and select Save as
    cy.get('.action-bar-wrapper')
      .contains('div', 'Save')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Save as')
      .click()

    // 1. Save Profile Popup is shown on the screen
    cy.get('[role="presentation"]')
      .find('.form-dialog-title-container')
      .contains('div', 'Save Profile')
      .should('exist')


    //Step 23: Enter the TC04 Profile Name, select Layout Including input data and Save
    const profileNameTC04 = 'TC04-layout_with_data-' + moment().format('YYYYMMDD-HHmm')

    //Enter the Profile Name "TC04-layout_with_data-[date]-[time]" (e.g. TC04_layout_with_data-20230329-1200)
    cy.get('[role="presentation"]')
      .find('.profile-dialog-input')
      .find('input')
      .type(profileNameTC04);

    //select Layout Including input data
    cy.get('[role="presentation"]')
      .find('.radio-button-container')
      .contains('span', 'Layout including input data')
      .click()

    //select Layout Including input data
    cy.get('[role="presentation"]')
      .find('.button-wrapper')
      .contains('button', 'Save')
      .click()

    //1. Successful Message is popup
    cy.get('[role="presentation"]')
      .contains('h6', 'Congratulations')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('button', 'OK')
      .click()

    //2. the Profile Name (TC04_layout_with_data-20230329-1200) is shown on the top right corner
    cy.get('.profile-name')
      .contains('div', profileNameTC04)
      .should('exist')

    //Step 24:  Change the Profile from TC04 to TC01 and Click the Widget Button

    cy.get('.profile-name')
      .contains('div', profileNameTC04)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC01}"]`)
      .filter('[role="option"]')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC01)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC04}"]`)
      .filter('[role="option"]')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC04)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC01}"]`)
      .filter('[role="option"]')
      .click()
    //1. Quantity with value 1,000,000 is shown
    cy.get('#qty-input').should('has.value', '1,000,000');

    //2. Instrument Characteristics, Historical Intraday Profiles, Optimized Parameters,
    // and Trade Schedule Estimate are turning On
    //Click Save Button and select Save as
    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    cy.get('[role="presentation"]')
      .contains('li', 'Historical Intraday Profiles')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Instrument Characteristics')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Optimized Parameters')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Trade Schedule Estimate')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('.MuiBackdrop-root').click();

    //Step 25:  Change the Profile from TC01 to TC02 and Click the Widget Button
    cy.get('.profile-name')
      .contains('div', profileNameTC01)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC02}"]`)
      .filter('[role="option"]')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC02)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC01}"]`)
      .filter('[role="option"]')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC01)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC02}"]`)
      .filter('[role="option"]')
      .click()
    //1. Quantity with value 5,000,000 is shown
    cy.get('#qty-input').should('has.value', '5,000,000');

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()


    //2. Instrument Characteristics,  Optimized Parameters, and Trade Schedule Estimate are turning On
    cy.get('[role="presentation"]')
      .contains('li', 'Instrument Characteristics')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Optimized Parameters')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Trade Schedule Estimate')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    //3. Historical Intraday Profiles is turning Off
    cy.get('[role="presentation"]')
      .contains('li', 'Historical Intraday Profiles')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')

    cy.get('.MuiBackdrop-root').click();

    //Step 26:  Change the Profile from TC02 to TC03 and Click the Widget Button
    cy.get('.profile-name')
      .contains('div', profileNameTC02)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC03}"]`)
      .filter('[role="option"]')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC03)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC02}"]`)
      .filter('[role="option"]')
      .click()

    cy.get('.profile-name')
      .contains('div', profileNameTC02)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC03}"]`)
      .filter('[role="option"]')
      .click()
    //1. Quantity with value 5,000,000 is shown
    cy.get('#qty-input').should('has.value', '100');

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    //2. Instrument Characteristics  and Trade Schedule Estimate are turning On
    cy.get('[role="presentation"]')
      .contains('li', 'Instrument Characteristics')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Trade Schedule Estimate')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    //3. Historical Intraday Profiles and Optimized Parameters are turning Off
    cy.get('[role="presentation"]')
      .contains('li', 'Historical Intraday Profiles')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Optimized Parameters')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')

    cy.get('.MuiBackdrop-root').click();

    //Step 27:  Change the Profile from TC03 to TC04 and Click the Widget Button
    cy.get('.profile-name')
      .contains('div', profileNameTC03)
      .click()

    cy.get('[role="presentation"]')
      .find(`li[data-value="${profileNameTC04}"]`)
      .filter('[role="option"]')
      .click()

    //1. Quantity with value 500 is shown
    cy.get('#qty-input').should('has.value', '500');

    cy.get('.action-bar-wrapper')
      .contains('div', 'Widget')
      .click()

    //2. Instrument Characteristics  is turning On
    cy.get('[role="presentation"]')
      .contains('li', 'Instrument Characteristics')
      .find('svg[data-testid="ToggleOnIcon"]')
      .should('exist')

    //3. Historical Intraday Profiles,  Trade Schedule Estimate and Optimized Parameters are turning Off
    cy.get('[role="presentation"]')
      .contains('li', 'Historical Intraday Profiles')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Optimized Parameters')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')

    cy.get('[role="presentation"]')
      .contains('li', 'Trade Schedule Estimate')
      .find('svg[data-testid="ToggleOffIcon"]')
      .should('exist')

    cy.get('.MuiBackdrop-root').click();

  })
})