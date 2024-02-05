describe('Step 4: Instrument Charactertics Test', () => {

  beforeEach(() => {

    cy.login();
    cy.dragExcel()
  });

  it('Turn On the Instrument Charactertics in the Widget Control Popup', () => {

    cy.contains('div', 'Widget').click();

    //1. Instrument Characteristics is shown on the screen
    cy.get('li').filter(':contains("Instrument Characteristics")').find('svg').click();
    cy.get('#instrument-characteristics-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.true;
    });

    cy.get('li').filter(':contains("Instrument Characteristics")').find('svg').click();
    cy.get('#instrument-characteristics-title').parent().parent().then(($parent) => {

      const hasHiddenClass = $parent.hasClass('hidden');

      expect(hasHiddenClass).to.be.false;
    });

  })


})