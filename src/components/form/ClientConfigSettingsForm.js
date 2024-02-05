import { useState, memo } from 'react'
import TextField from '@mui/material/TextField'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import useStores from '@src/utils/hooks/useStores'
import { Observer } from 'mobx-react'
import Box from '@src/components/layouts/box'

import CustomPicker from '@src/components/inputs/CustomPicker'
import Button from '@src/components/inputs/CustomButton'
import CustomTimePicker from '@src/components/inputs/CustomTimePicker'
import Picker from '@src/components/inputs/formilk/CustomPicker'
import customTextField from '@src/components/inputs/formilk/CustomTextField'
import Switch from '@src/components/inputs/formilk/CustomSwitch'

export default function AdditionalParameterForm ({ customerIdOptionList, clientConfigFieldList, initialValues, submitAction, bindFormikAction }) {

  return (
    <Observer>
      {
        () => {
          return (
            <div className='client-config-settings-form-content'>
              {
                <Formik
                  initialValues={initialValues}
                  // validate={validate}
                  onSubmit={submitAction}
                >
                  {(formikProps) => {
                    bindFormikAction(formikProps)
                    return (
                      <div className='form-container'>
                        <Form className='full-width' >
                          <div className='input-container'>
                            <div className='CustomerId-picker-container'>
                              <Field type="text" name='CustomerId' component={Picker} placeholder="" label={'CustomerId'} title='CustomerId' optionList={customerIdOptionList} defaultValue='' hasEmptyOption={true} />
                              <ErrorMessage className='warning' name='CustomerId' component="div" />
                            </div>
                            <div className='field-table-container'>
                              {
                                clientConfigFieldList.map((fieldName, index) => {
                                  return (
                                    <div key={index}>
                                      <Field type="text" name={fieldName} variant='standard' component={customTextField} placeholder={fieldName} label={fieldName} />
                                      <ErrorMessage className='warning' name={fieldName} component="div" />
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </Form>
                      </div>
                    )
                  }}
                </Formik >
              }
            </div>
          )
        }
      }
    </Observer>
  )
}