import { useNavigation } from '@react-navigation/native'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/mobile'
import React, { useCallback, useRef } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View
} from 'react-native'
import * as Yup from 'yup'
import Icon from 'react-native-vector-icons/Feather'
import ImagePicker from 'react-native-image-picker'
import Button from '../../components/Button'
import Input from '../../components/Input'
import api from '../../services/api'

import getValidationErrors from '../../utils/getValidationErrors'
import {
  Container,
  BackButton,
  UserAvatarButton,
  UserAvatar,
  Title
} from './styles'
import { useAuth } from '../../hooks/auth'

interface ProfileData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}
const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()

  const navigation = useNavigation()
  const formRef = useRef<FormHandles>(null)

  const emailInputRef = useRef<TextInput>(null)
  const oldPasswordInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const confirmPasswordInputRef = useRef<TextInput>(null)

  const handleSignUp = useCallback(
    async (data: ProfileData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório'),
          email: Yup.string()
            .required('E-mail Obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required('Campo obrigatorio'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatorio'),
              otherwise: Yup.string()
            })
            .oneOf([Yup.ref('password')], 'Senhas Diferentes')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation
        } = data

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation
              }
            : {})
        }

        const response = await api.put('/profile', formData)

        updateUser(response.data)

        Alert.alert('Cadastrado com  cadastro')

        navigation.goBack()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }
        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao tentar cadastarr, tente novamente'
        )
      }
    },
    [navigation, updateUser]
  )
  const handleUdpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar Camera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria'
      },
      (response) => {
        if (response.didCancel) {
          return
        }

        if (response.error) {
          Alert.alert('Erro ao atualizar seu avatar')
          return
        }

        const data = new FormData()

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri
        })

        api
          .patch('users/avatar', data)
          .then((responses) => updateUser(responses.data))
      }
    )
  }, [updateUser, user.id])

  const handleGoback = useCallback(() => {
    navigation.goBack()
  }, [navigation])
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
            <BackButton onPress={handleGoback}>
              <Icon name="chevron-left" size={40} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={handleUdpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu Perfil</Title>
            </View>
            <Form
              initialData={{
                name: user.name,
                email: user.email
              }}
              ref={formRef}
              onSubmit={handleSignUp}
            >
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus()
                }}
              />

              <Input
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus()
                }}
              />
              <Input
                containerStyle={{ marginTop: 16 }}
                ref={oldPasswordInputRef}
                name="old_password"
                icon="lock"
                placeholder="Senha Atual"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Nova senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus()
                }}
              />

              <Input
                ref={confirmPasswordInputRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirme a senha"
                secureTextEntry
                textContentType="newPassword"
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
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default Profile
