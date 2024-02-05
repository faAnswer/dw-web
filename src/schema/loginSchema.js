import * as yup from 'yup'

const loginSchema = yup.object().shape({
  userId: yup.string().required('Required'),
  password: yup.string().required('Required'),
})

export default loginSchema