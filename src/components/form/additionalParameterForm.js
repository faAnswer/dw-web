import { useState, memo, useEffect, useCallback } from 'react'
import TextField from '@mui/material/TextField'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import useStores from '@src/utils/hooks/useStores'
import { Observer } from 'mobx-react'

import AdditionalParameterOptionForm from '@src/components/form/additionalParameterOptionForm'
import AdditionalParameterTableForm from '@src/components/form/additionalParameterTableForm'

export default function AdditionalParameterForm ({ setMessageDialog, setMessageType, additionalParamsSelectedList, additionalParamsOptionList, initialValues, submitAction, bindFormikAction }) {
  // const [additionalParamsList, setAdditionParamsList] = useState([])
  const { commonStore } = useStores()
  const [additionParams, setAdditionParams] = useState('')
  const [additionParamsInitValue, setAdditionParamsInitValue] = useState('')
  useEffect(() => {
    commonStore.setSelectedAdditionalParams(additionParams)
    if (additionParams) {
      switch (commonStore.additionalParamsSelectedOption.type) {
        case 'Int':
        case 'Float':
          setAdditionParamsInitValue('')
          break;
        case 'UTC Time':
          setAdditionParamsInitValue('')
          break;
        case 'Categorical':
          setAdditionParamsInitValue('')
          break;
        case 'String':
          setAdditionParamsInitValue('')
          break;
        default:
          break;
      }
    }
  }, [additionParams])

  useEffect(() => {
    if (additionParamsInitValue) {
      commonStore.setSelectedAdditionParamsInitValue(additionParamsInitValue)
    }
  }, [additionParamsInitValue])

  const handleSubmitAdditionParamsOption = useCallback(async () => {
    if (!additionParams) {
      setMessageDialog(true)
      setMessageType('MISSING_PARAM_FIELD')
      return
    }
    if (additionParamsInitValue === '' || additionParamsInitValue === 'Invalid date' || additionParamsInitValue === undefined) {
      setMessageDialog(true)
      setMessageType('INVALID_ADDITIONAL_PARAMS_FIELD')
      return
    }
    await commonStore.setAdditionalParamsSelectedList(additionParams, additionParamsInitValue)
    const currentAdditionParams = additionParams
    setAdditionParams('')
    await commonStore.removeAdditionParamsOptionListItem(currentAdditionParams)
    commonStore.clearSelectedAdditionalParams()
    commonStore.clearSelectedAdditionParamsInitValue()
  }, [additionParams, additionParamsInitValue])

  const handleDeleteAdditionalParamsItem = useCallback(async (itemLabel) => {
    await commonStore.removeAdditionalParamsItem(itemLabel)
    // await commonStore.updateAdditionParamsInitPreviewForm()
  }, [])

  return (
    <Observer>
      {
        () => {
          return (
            <div className='addition-parameter-form-content'>
              <AdditionalParameterOptionForm
                additionalParamsOptionList={additionalParamsOptionList}
                setAdditionParams={setAdditionParams}
                additionParams={additionParams}
                setAdditionParamsInitValue={setAdditionParamsInitValue}
                additionParamsInitValue={additionParamsInitValue}
                additionalParamsSelectedOption={commonStore.additionalParamsSelectedOption}
                handleSubmitButtonClick={handleSubmitAdditionParamsOption}
              />
              <AdditionalParameterTableForm
                bindFormikAction={bindFormikAction}
                additionalParamsSelectedList={additionalParamsSelectedList}
                submitAction={submitAction}
                initialValues={initialValues}
                deleteItemAction={handleDeleteAdditionalParamsItem}
              />
            </div>
          )
        }
      }
    </Observer>
  )
}