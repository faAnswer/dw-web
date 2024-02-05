describe('Step 3: Client Config Settings Test', () => {

  beforeEach(() => {

    cy.login();
    cy.dragExcel()
  });

  it('Click "CLIENT CONFIG SETTINGS', () => {

    cy.get('#client-config-btn').click();

    //1. Showing Client Config Settings Value
    //1.1. CustomerID: BGI
    cy.get('.CustomerId-picker-container').find('[aria-haspopup="listbox"]').should('have.text', 'BGI');

    //1.2. Text: Client text
    cy.get('.field-table-container').find('input').eq(0).should('have.value', 'client text');


    //1.3. client SpectrumUrgency
    cy.get('.field-table-container').find('input').eq(1).should('have.value', 'client SpectrumUrgency');


  })


})