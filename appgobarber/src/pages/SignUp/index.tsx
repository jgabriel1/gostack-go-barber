import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Container, Title, BackToSignIn, BackToSignInText } from './styles'

import logoImg from '../../assets/logo.png'
import getValidationErrors from '../../utils/getValidationErrors'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)

  const [isKeybaordUp, setIsKeyboardUp] = useState(false)

  const navigation = useNavigation()

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (Platform.OS === 'android') {
      const show = Keyboard.addListener('keyboardDidShow', () => {
        setIsKeyboardUp(current => !current)
      })

      const hide = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardUp(current => !current)
      })

      return () => {
        show.remove()
        hide.remove()
      }
    }
  }, [])

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório.'),
        email: Yup.string()
          .required('E-mail obrigatório.')
          .email('Digite um e-mail válido.'),
        password: Yup.string().min(6, 'No mí­nimo 6 dí­gitos.'),
      })

      await schema.validate(data, { abortEarly: false })

      // await api.post('users', data)

      // history.push('/')

      Alert.alert(
        'Cadastro realizado com sucesso!',
        'Você já¡ pode fazer seu logon no GoBarber.',
      )
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(Object.fromEntries(errors))
        return
      }

      Alert.alert(
        'Erro no cadastro.',
        'Ocorreu um erro ao fazer cadastro, tente novamente.',
      )
    }
  }, [])

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCorrect
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onEndEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onEndEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onEndEditing={() => formRef.current?.submitForm()}
              />
            </Form>

            <Button onPress={() => formRef.current?.submitForm()}>
              Entrar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      {!isKeybaordUp && (
        <BackToSignIn onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSignInText>Voltar para logon</BackToSignInText>
        </BackToSignIn>
      )}
    </>
  )
}

export default SignUp
