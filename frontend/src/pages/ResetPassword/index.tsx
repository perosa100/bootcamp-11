import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import { FiLock, FiLogIn } from 'react-icons/fi'
import { Link, useHistory, useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import logoImg from '../../assets/logo.svg'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../utils/getValidationErrors'
import { AnimationContainer, Background, Container, Content } from './styles'
import api from '../../services/api'

interface ResetPasswordormData {
  password: string
  password_confirmation: string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()
  const history = useHistory()
  const location = useLocation()
  const handleSubmit = useCallback(
    async (data: ResetPasswordormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha Obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Senhas Diferentes'
          )
        })

        await schema.validate(data, {
          abortEarly: false
        })

        const { password, password_confirmation } = data
        const token = location.search.replace('?token=', '')
        console.log(token)

        if (!token) {
          throw new Error()
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token
        })

        addToast({
          type: 'success',
          title: 'Alteração efetuada com successo',
          description: 'Encaminanhando para login'
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
          title: 'Erro ao resetar sua senha',
          description: 'Ocorreu um erro ao  resetar sua senha, Tente novament'
        })
      }
    },
    [location.search, history, addToast]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

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
              placeholder="Confirmação da senha"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>

          <Link to="/SignIn">
            <FiLogIn size={20} />
            Voltar para login
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  )
}

export default ResetPassword
