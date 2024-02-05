import { Formik, Form, Field, ErrorMessage } from 'formik'
import CustomTextField from '@src/components/inputs/formilk/CustomTextField'
import Box from '@src/components/layouts/box'
import loginSchema from '@src/schema/loginSchema'

const validate = values => {
  const errors = {}
  if (!values.email) {
    errors.email = 'Required'
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address'
  }
  return errors
}

export default function loginForm (props) {
  const { initialValues, submitAction, bindFormikAction } = props
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={submitAction}
    >
      {(formikProps) => {
        bindFormikAction(formikProps)
        return (
          <Form className='login-form-full-width' >
            <Field name='userId' label='User Id' component={CustomTextField} id='user-id-input' autoComplete='userId' />
            <ErrorMessage className='warning' name='userId' component='div' />
            <Box size={2} />
            <Field type='password' name='password' label='Password' component={CustomTextField} id='password-input' autoComplete='password' />
            <ErrorMessage className='warning' name='password' component='div' />
          </Form>
        )
      }}
    </Formik >
  )
}
