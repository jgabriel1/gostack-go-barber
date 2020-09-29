import React, { useRef, useCallback } from 'react'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Link, useHistory } from 'react-router-dom'

import Button from '../../components/Button'
import Input from '../../components/Input'

import getValidationErrors from '../../utils/getValidationErrors'
import { useToast } from '../../hooks/toast'

import { Container, Content, AnimationContainer, Background } from './styles'

import logo from '../../assets/logo.svg'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório.')
            .email('Digite um e-mail válido.'),
        })

        await schema.validate(data, { abortEarly: false })

        // password recovery

        // history.push('/dashboard')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(Object.fromEntries(errors))
          return
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha.',
          description:
            'Ocorreu um erro ao tentar recuperar a senha, tente novamente.',
        })
      }
    },
    [addToast],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button type="submit">Recuperar</Button>
          </Form>

          <Link to="signup">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  )
}

export default ForgotPassword
