import { useState, memo } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import useStores from '@src/utils/hooks/useStores'
import { Observer } from 'mobx-react'
import Box from '@src/components/layouts/box'
import CustomButton from '@src/components/inputs/CustomButton'

import customTextField from '@src/components/inputs/formilk/CustomTextField'
import customNumberField from '@src/components/inputs/formilk/CustomNumberField'
import CustomDecimalNumber from '@src/components/inputs/formilk/CustomDecimalNumber'
import OptimizedParamsSchema from '@src/schema/optimizedParamsSchema'
import Picker from '@src/components/inputs/formilk/CustomPicker'
import { toJS } from 'mobx'

export default function OptimizedParamsForm (props) {
  const {
    initialValues, submitAction, bindFormikAction, sideOptionList, orderOptionList, strategyOptionList, setAdditionalFormDialog, setClientConfigFormDialog
  } = props
  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={OptimizedParamsSchema}
        onSubmit={submitAction}
      >
        {(formikProps) => {
          bindFormikAction(formikProps)
          const inactiveSection = (formikProps.values.side === '' && formikProps.values.orderType === '' && formikProps.values.strategy === '')
          return (
            <>
              <Form className={`full-width ${inactiveSection ? 'inactive' : ''}`}>
                <div className='info-text'>{'Optional (Only required for Optimized Parameters):'}</div>
                <div className='optimized-param-input-field-form'>
                  <div className='input-column-1'>
                    <div>
                      <Field id='side-picker' type="text" name='side' component={Picker} placeholder='Side' label='Side' title='Side' optionList={sideOptionList} hasEmptyOption={true} />
                      <ErrorMessage className='warning' name='side' component="div" />
                    </div>
                    <Box size={1} />
                    <div>
                      <Field id='order-type-picker' type="text" name='orderType' component={Picker} placeholder='Order Type' title='Order Type' label='Order Type' optionList={orderOptionList} hasEmptyOption={true} />
                      <ErrorMessage className='warning' name='orderType' component="div" />
                    </div>
                    {
                      formikProps.values.orderType === 'LIMIT' &&
                      <div>
                        <Field id='limit-price-input' name='price' variant='standard' component={CustomDecimalNumber} placeholder='Limit Price' title='Limit Price' label='Limit Price' InputProps={{ inputProps: { min: 0 } }} />
                        <ErrorMessage className='warning' name='price' component="div" />
                      </div>
                    }
                  </div>
                  <div className='input-column-2'>
                    <div>
                      <Field id='strategy-picker' type="text" name='strategy' component={Picker} placeholder='Strategy' label='Strategy' title='Strategy' optionList={strategyOptionList} hasEmptyOption={true} />
                      <ErrorMessage className='warning' name='strategy' component="div" />
                    </div>
                    <Box size={1} />
                    <div className='addition-param-btn'>
                      <CustomButton id='addition-params-btn' variant='text' size="small" onClick={() => setAdditionalFormDialog(true)}>Additional Parameter</CustomButton>
                    </div>
                    <Box size={1} />
                    <div className='client-config-btn'>
                      <CustomButton id='client-config-btn' variant='text' size="small" onClick={() => setClientConfigFormDialog(true)}>Client Config Settings</CustomButton>
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
