import * as yup from 'yup'

const getAdditionalParamsSchema = ({ form, additionalParamsSelectedList }) => {
  const yupObject = {}
  // const formFieldNameList = Object.keys(form)

  additionalParamsSelectedList.forEach((paramOption) => {
    // yupObject[paramOption.label]
    const type = paramOption.type
    const fieldName = paramOption.label
    switch (type) {
      case 'Categorical':
        yupObject[fieldName] = yup.string().required('Invalid Input')
        break;
      case 'Float':
        yupObject[fieldName] = yup.number('Invalid Input').typeError('Invalid Input').required('Invalid Input')
        break;
      case 'Int':
        yupObject[fieldName] = yup.number('Invalid Input').typeError('Invalid Input').required('Invalid Input')
        break;
      case 'UTC Time':
        yupObject[fieldName] = yup.date('Invalid Input').typeError('Invalid Input').required('Invalid Input')
        break;
      case 'String':
        yupObject[fieldName] = yup.string('Invalid Input').required('Invalid Input')
        break;
    }
  })


  // formFieldNameList.forEach((fieldName) => {
  //   yupObject[fieldName] = yup.string().required('Required')
  // })
  return yup.object().shape(yupObject)
}

export default getAdditionalParamsSchema