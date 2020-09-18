import { useNavigation } from '@react-navigation/native'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/mobile'
import React, { useCallback, useRef } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import * as Yup from 'yup'
import logoImg from '../../assets/logo.png'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useAuth } from '../../hooks/auth'
import getValidationErrors from '../../utils/getValidationErrors'
import {
  Container,
  CreateAccountButton,
  CreateAccountButtonText,
  ForgotPassword,
  ForgotPasswordText,
  Title
} from './styles'

interface SignInFormData {
  email: string
  password: string
}
const SignIn: React.FC = () => {
  const navigation = useNavigation()
  const passwordInputRef = useRef<TextInput>(null)
  const formRef = useRef<FormHandles>(null)
  const { signIn, user } = useAuth()


  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail Obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'Minimo de 6 caracteres')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await signIn({
          email: data.email,
          password: data.password
        })

        /*   history.push('/dashboard') */
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }
        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais'
        )
      }
    },
    [signIn]
  )

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm()
                }}
              >
                Entrar
              </Button>
            </Form>
            <ForgotPassword
              onPress={() => {
                navigation.navigate('SignUp')
              }}
            >
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton
        onPress={() => {
          navigation.navigate('SignUp')
        }}
      >
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar Conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  )
}

export default SignIn
