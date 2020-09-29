import React, { useRef, useCallback } from 'react'
import { FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { useHistory, useParams, useLocation } from 'react-router-dom'

import Button from '../../components/Button'
import Input from '../../components/Input'

import getValidationErrors from '../../utils/getValidationErrors'
import { useToast } from '../../hooks/toast'

import { Container, Content, AnimationContainer, Background } from './styles'

import logo from '../../assets/logo.svg'
import api from '../../services/api'

interface ResetPasswordFormData {
  password: string
  password_confirmation: string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()

  const history = useHistory()
  const location = useLocation()

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória.'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Confirmação incorreta.',
          ),
        })

        await schema.validate(data, { abortEarly: false })

        const token = location.search.replace('?token=', '')

        if (!token) throw new Error()

        await api.post('/password/reset', {
          password: data.password,
          password_confirmation: data.password_confirmation,
          token,
        })

        history.push('/')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(Object.fromEntries(errors))
          return
        }

        addToast({
          type: 'error',
          title: 'Erro no reset de senha.',
          description: 'Ocorreu um erro ao resetar a senha, tente novamente.',
        })
      }
    },
    [addToast, history, location],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar Senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova Senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da Senha"
            />

            <Button type="submit">Aterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  )
}

export default ResetPassword
