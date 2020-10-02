import React, { useRef, useCallback } from 'react'
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import Icon from 'react-native-vector-icons/Feather'

import getValidationErrors from '../../utils/getValidationErrors'
import { useAuth } from '../../hooks/auth'
import api from '../../services/api'

import Input from '../../components/Input'
import Button from '../../components/Button'

import {
  Container,
  Title,
  UserAvatar,
  UserAvatarButton,
  PasswordInputs,
  BackButton,
} from './styles'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const Profile: React.FC = () => {
  const { user, signOut } = useAuth()

  const formRef = useRef<FormHandles>(null)
  const emailInputRef = useRef<TextInput>(null)
  const oldPasswordInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const confirmPasswordInputRef = useRef<TextInput>(null)

  const navigation = useNavigation()

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
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

        await api.post('users', data)

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer seu logon no GoBarber.',
        )

        navigation.goBack()
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
    },
    [navigation],
  )

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

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
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={() => signOut()}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu Perfil</Title>
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
                onEndEditing={() => oldPasswordInputRef.current?.focus()}
              />

              <PasswordInputs>
                <Input
                  ref={oldPasswordInputRef}
                  secureTextEntry
                  name="old_password"
                  icon="lock"
                  placeholder="Senha atual"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onEndEditing={() => passwordInputRef.current?.focus()}
                />
                <Input
                  ref={passwordInputRef}
                  secureTextEntry
                  name="password"
                  icon="lock"
                  placeholder="Nova senha"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onEndEditing={() => confirmPasswordInputRef.current?.focus()}
                />
                <Input
                  ref={confirmPasswordInputRef}
                  secureTextEntry
                  name="password"
                  icon="lock"
                  placeholder="Confirmar senha"
                  textContentType="newPassword"
                  returnKeyType="send"
                  onEndEditing={() => formRef.current?.submitForm()}
                />
              </PasswordInputs>
            </Form>

            <Button onPress={() => formRef.current?.submitForm()}>
              Confirmar mudanças
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default Profile
