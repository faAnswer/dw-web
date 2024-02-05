import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import CustomPicker from '@src/components/inputs/CustomPicker'
import CustomTimePicker from '@src/components/inputs/CustomTimePicker'
import CustomTextField from '@src/components/inputs/formilk/CustomTextField'
import CustomDecimalNumber from '@src/components/inputs/formilk/CustomDecimalNumber'
import CustomNumberField from '@src/components/inputs/formilk/CustomNumberField'

export default function AdditionParameterOptionForm (props) {
  const {
    additionalParamsOptionList, setAdditionParams, additionParams,
    setAdditionParamsInitValue, additionParamsInitValue,
    additionalParamsSelectedOption, handleSubmitButtonClick
  } = props
  return (
    <div className='picker-input-session'>
      <div className='params-option-input-container'>
        <div className='selector-wrapper'>
          <CustomPicker
            optionList={additionalParamsOptionList}
            setFieldValue={setAdditionParams}
            value={additionParams}
            hasDescription={true}
          />
        </div>
        <div className='init-input-wrapper'>
          {
            additionalParamsSelectedOption && additionalParamsSelectedOption.type === 'Float' &&
            <div className='init-input-field'>
              <CustomDecimalNumber
                label={'Value'}
                placeholder={additionalParamsSelectedOption.sample ? additionalParamsSelectedOption.sample : ''}
                isFormik={false}
                setFieldValue={setAdditionParamsInitValue}
                field={{ value: additionParamsInitValue }}
              />
            </div>
          }
          {
            additionalParamsSelectedOption && additionalParamsSelectedOption.type === 'Int' &&
            <div className='init-input-field'>
              <CustomDecimalNumber
                label={'Value'}
                placeholder={additionalParamsSelectedOption.sample ? additionalParamsSelectedOption.sample : ''}
                isFormik={false}
                includeDecimalPoint={false}
                setFieldValue={setAdditionParamsInitValue}
                field={{ value: additionParamsInitValue }}
              />
            </div>
          }
          {
            additionalParamsSelectedOption && additionalParamsSelectedOption.type === 'UTC Time' &&
            <div className='init-input-field'>
              <CustomTimePicker
                disableErrorColor={true}
                label={'Value'}
                placeholder={additionalParamsSelectedOption.sample ? additionalParamsSelectedOption.sample : ''}
                includeSecond={true}
                disableOpenPicker={true}
                field={{ value: additionParamsInitValue }}
                removeTimezoneIndicate={true}
                form={{ setFieldValue: (name, newValue) => { setAdditionParamsInitValue(newValue) } }}
              />
            </div>
          }
          {
            additionalParamsSelectedOption && additionalParamsSelectedOption.type === 'Categorical' &&
            <div className='init-input-field'>
              <CustomPicker
                title={'Value'}
                optionList={additionalParamsSelectedOption.options}
                setFieldValue={setAdditionParamsInitValue}
                value={additionParamsInitValue}
              />
            </div>
          }
          {
            additionalParamsSelectedOption && additionalParamsSelectedOption.type === 'String' &&
            <div className='init-input-field'>
              <CustomTextField
                label={'Value'}
                placeholder={additionalParamsSelectedOption.sample ? additionalParamsSelectedOption.sample : ''}
                isFormik={false}
                setFieldValue={setAdditionParamsInitValue}
                field={{ value: additionParamsInitValue }}
                form={{ setFieldValue: (name, newValue) => { setAdditionParamsInitValue(newValue) } }}
              />
            </div>
          }
        </div>
      </div>
      <div className='button-wrapper'>
        <IconButton onClick={handleSubmitButtonClick}>
          <AddIcon />
        </IconButton>
      </div>
    </div>
  )
}