import { Formik, Form, Field, ErrorMessage } from 'formik'
import Box from '@src/components/layouts/box'

import CustomTimePicker from '@src/components/inputs/CustomTimePicker'
import Picker from '@src/components/inputs/formilk/CustomPicker'
import Switch from '@src/components/inputs/formilk/CustomSwitch'
import CustomTextField from '@src/components/inputs/formilk/CustomTextField'
import CustomDecimalNumber from '@src/components/inputs/formilk/CustomDecimalNumber'

import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import getAdditionalParamsSchema from '@src/schema/additionalParamsSchema'

export default function AdditionalParameterTableForm ({ bindFormikAction, additionalParamsSelectedList, submitAction, initialValues, deleteItemAction }) {
  return (
    <Formik
      initialValues={initialValues}
      // validate={validate}
      validationSchema={getAdditionalParamsSchema({ form: initialValues, additionalParamsSelectedList })}
      enableReinitialize
      onSubmit={submitAction}
    >
      {(formikProps) => {
        bindFormikAction(formikProps)
        return (
          <div className='form-container'>
            <Form className='full-width' >
              <div className='table-header-container'>
                <div>Parameter</div>
                <div>Value</div>
                <div>Action</div>
              </div>
              <div className='table-body-container'>
                {
                  additionalParamsSelectedList.map((additionalParams, index) => {
                    return (
                      <div key={index}>
                        {
                          additionalParams.type === 'Int' &&
                          <div className='table-row-container'>
                            <Tooltip title={additionalParams.description}>
                              <div className='additional-table-form-label'>
                                {additionalParams.label}
                              </div>
                            </Tooltip>
                            <div className='additional-table-form-value'>
                              <Field type="number" name={additionalParams.label} component={CustomDecimalNumber} placeholder="" label={additionalParams.sample ? additionalParams.sample : ''} includeDecimalPoint={false} />
                              <div className='error'>
                                <ErrorMessage className='additional-form-warning' name={additionalParams.label} component="div" />
                              </div>
                            </div>
                            <div className='additional-table-form-delete-btn'>
                              <IconButton onClick={() => deleteItemAction(additionalParams.label)}>
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </div>
                        }
                        {
                          additionalParams.type === 'Float' &&
                          <div className='table-row-container'>
                            <Tooltip title={additionalParams.description}>
                              <div className='additional-table-form-label'>
                                {additionalParams.label}
                              </div>
                            </Tooltip>
                            <div className='additional-table-form-value'>
                              <Field type="number" name={additionalParams.label} component={CustomDecimalNumber} label={additionalParams.sample ? additionalParams.sample : ''} />
                              <div className='error'>
                                <ErrorMessage className='additional-form-warning' name={additionalParams.label} component="div" />
                              </div>
                            </div>
                            <div className='additional-table-form-delete-btn'>
                              <IconButton onClick={() => deleteItemAction(additionalParams.label)}>
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </div>
                        }
                        {
                          additionalParams.type === 'UTC Time' &&
                          <div className='table-row-container'>
                            <Tooltip title={additionalParams.description}>
                              <div className='additional-table-form-label'>
                                {additionalParams.label}
                              </div>
                            </Tooltip>
                            <div className='timestamp-input-field'>
                              <Field type="text" name={additionalParams.label} component={CustomTimePicker} placeholder={additionalParams.sample ? additionalParams.sample : 'hh:mm:ss'} label={''} disableOpenPicker={true} includeSecond={true} removeTimezoneIndicate={true} disableErrorColor={true} />
                              <div className='error'>
                                <ErrorMessage className='additional-form-warning' name={additionalParams.label} component="div" />
                              </div>
                            </div>
                            <div className='additional-table-form-delete-btn'>
                              <IconButton onClick={() => deleteItemAction(additionalParams.label)}>
                                <DeleteIcon />
                              </IconButton></div>
                          </div>
                        }
                        {
                          additionalParams.type === 'Categorical' &&
                          <div className='table-row-container'>
                            <Tooltip title={additionalParams.description}>
                              <div className='additional-table-form-label'>
                                {additionalParams.label}
                              </div>
                            </Tooltip>
                            <div className='categorical-input-field'>
                              <Field type="text" name={additionalParams.label} component={Picker} title={additionalParams.sample ? additionalParams.sample : ''} optionList={additionalParams.options} Ï />
                              <div className='error'>
                                <ErrorMessage className='additional-form-warning' name={additionalParams.label} component="div" />
                              </div>
                            </div>
                            <div className='additional-table-form-delete-btn'>
                              <IconButton onClick={() => deleteItemAction(additionalParams.label)}>
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </div>
                        }
                        {
                          additionalParams.type === 'String' &&
                          <div className='table-row-container'>
                            <Tooltip title={additionalParams.description}>
                              <div className='additional-table-form-label'>
                                {additionalParams.label}
                              </div>
                            </Tooltip>
                            <div className='additional-table-form-value'>
                              <Field name={additionalParams.label} component={CustomTextField} placeholder="" label={additionalParams.sample ? additionalParams.sample : ''} />
                              <div className='error'>
                                <ErrorMessage className='additional-form-warning' name={additionalParams.label} component="div" />
                              </div>
                            </div>
                            <div className='additional-table-form-delete-btn'>
                              <IconButton onClick={() => deleteItemAction(additionalParams.label)}>
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </div>
                        }
                      </div>
                    )
                  })
                }
              </div>

            </Form>
          </div>
        )
      }}
    </Formik >
  )
}