const moment = require('moment');
const excelFileStartWith = 'Portfolio_template_with_params'

describe('Step 10: Update History Test', () => {

  beforeEach(() => {

    cy.login();
    cy.get('#portfolio-tab').click();
    cy.dragPortfolioExcel()

  });



  it('Step 10: Update History Test', () => {
    let dragTime;

    const currentMoment = moment()
    const currentTime = currentMoment.format("YYYY-MM-DD HH:mm")

    cy.get('.portfolio-upload-csv-section')
      .find('.dropzone-content-wrapper')
      .contains('div', 'Upload History')
      .click()

    const firstRow = cy.get('.upload-history-box')
      .find('.history-list-container')
      .eq(0);

    //1. Showing Record with File Name "Portfolio_template_with_params_20230414.xlsx" with Uploaded Date & Time same as Marked Current Time
    firstRow.find('div').eq(0).should('contain', excelFileStartWith);

    firstRow.find('div')
      .eq(1)
      .then(($element) =>{

        const currentTimeAddOneMinute = currentMoment.add(1, 'minute').format("YYYY-MM-DD HH:mm")

        const hasText = $element.text() === currentTime || $element.text() === currentTimeAddOneMinute;

        expect(hasText).to.be.true;

      })

  })
})
