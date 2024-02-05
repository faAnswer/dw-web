import { useState, memo } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import useStores from '@src/utils/hooks/useStores'
import { Observer } from 'mobx-react'
import Box from '@src/components/layouts/box'

import customTextField from '@src/components/inputs/formilk/CustomTextField'
import customNumberField from '@src/components/inputs/formilk/CustomNumberField'
import CustomDecimalNumber from '@src/components/inputs/formilk/CustomDecimalNumber'
import Picker from '@src/components/inputs/formilk/CustomPicker'
import inputFieldSchema from '@src/schema/inputFormSchema'
import { toJS } from 'mobx'

export default function AdditionalParameterForm (props) {
  const {
    initialValues, submitAction, bindFormikAction, sideOptionList, defaultSideValue
  } = props
  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={inputFieldSchema}
        onSubmit={submitAction}
      >
        {(formikProps) => {
          bindFormikAction(formikProps)
          return (
            <>
              <Form className='full-width' >
                <div className='input-field-form-wrapper'>
                  <div className='input-column-1'>
                    <div>
                      <Field id='ric-input' type="text" name='stock' variant='standard' component={customTextField} placeholder='Reuters Symbol (RIC)' label='Reuters Symbol (RIC)' withStyledRequiredSymbol={true} />
                      <ErrorMessage id='ric-error-label' className='warning' name='stock' component="div" />
                    </div>
                    <Box size={1} />
                    <div>
                      <Field id='qty-input' name='quantity' variant='standard' component={customNumberField} placeholder='Quantity' label='Quantity' withStyledRequiredSymbol={true} />
                      <ErrorMessage id='qty-error-label' className='warning' name='quantity' component="div" />
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )
        }}
      </Formik >
    </>
  )
}
