const moment = require('moment');
const excelFileStartWith = 'Single_stock_template_with_params'

describe('Step 11: Click Upload History Test', () => {

  beforeEach(() => {

    cy.login()
    cy.dragExcel()


  });

  it('Click Upload History', () => {

    let dragTime;

    const currentMoment = moment()
    const currentTime = currentMoment.format("YYYY-MM-DD HH:mm")

    cy.get('.upload-csv-section')
      .find('.dropzone-content-wrapper')
      .contains('div', 'Upload History')
      .click()

    const firstRow = cy.get('.upload-history-box')
                      .find('.history-list-container')
                      .eq(0);

    //1. Showing Record with File Name "Single_stock_template_with_params_20230329.xlsx" with Uploaded Date & Time same as Marked Current Time
    firstRow.find('div').eq(0).should('contain', excelFileStartWith);
    firstRow.find('div')
      .eq(1)
      .then(($element) =>{

        const currentTimeAddOneMinute = currentMoment.add(1, 'minute').format("YYYY-MM-DD HH:mm")

        const hasText = $element.text() === currentTime || $element.text() === currentTimeAddOneMinute;

        expect(hasText).to.be.true;

      })  })
})
