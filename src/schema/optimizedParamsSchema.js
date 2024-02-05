import * as yup from 'yup'

const OptimizedParamsSchema = yup.object().shape({
  side: yup.string().required('Required for Optimized Parameters'),
  orderType: yup.string().required('Required for Optimized Parameters'),
  strategy: yup.string().required('Required for Optimized Parameters'),
  price: yup.number().min(1, 'Required for Optimized Parameters').required('Required for Optimized Parameters')
})

export default OptimizedParamsSchema