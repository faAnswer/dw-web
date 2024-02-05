import * as yup from 'yup'

const InputFormSchema = yup.object().shape({
  stock: yup.string().required('Required'),
  quantity: yup.number().integer().min(1, 'min: 1').required('Required'),
  // price: yup.number(),
  // side: yup.string().required('Required'),
  // orderType: yup.string().required('Required'),
})

export default InputFormSchema