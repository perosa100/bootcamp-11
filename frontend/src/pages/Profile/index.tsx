import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef, ChangeEvent } from 'react'
import { FiArrowLeft, FiLock, FiMail, FiUser, FiCamera } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useToast } from '../../hooks/toast'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'
import { Container, Content, AvatarInput } from './styles'
import { useAuth } from '../../hooks/auth'

interface ProfileData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}
const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()

  const { user, updateUser } = useAuth()

  const handleSubmit = useCallback(
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

        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso',
          description: 'Redirecionado a página inicial'
        })

        history.push('/')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }
        addToast({
          type: 'error',
          title: 'Perfil não pode ser atualizado',
          description: 'Ocorreu um erro ao fazer a atualização, tente novamente'
        })
      }
    },
    [addToast, history]
  )

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData()

        data.append('avatar', e.target.files[0])

        await api.patch('/users/avatar', data).then((response) => {
          updateUser(response.data)
        })
      }
      addToast({
        type: 'success',
        title: 'Alteração efetuada',
        description: 'Caso queira alterar boa srote'
      })
    },
    [addToast, updateUser]
  )
  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          onSubmit={handleSubmit}
          initialData={{
            name: user.name,
            email: user.email
          }}
          ref={formRef}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt="" />
            <label htmlFor="avatar">
              <FiCamera />

              <input id="avatar" type="file" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Name" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirme a nova senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft size={20} />
          Voltar para logon
        </Link>
      </Content>
    </Container>
  )
}

export default Profile
