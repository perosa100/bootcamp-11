import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import { FiArrowLeft, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import logoImg from '../../assets/logo.svg'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useToast } from '../../hooks/toast'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'
import { AnimationContainer, Background, Container, Content } from './styles'

interface SignUpData {
  name: string
  email: string
  password: string
}
const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()

  const handleSubmit = useCallback(
    async (data: SignUpData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório'),
          email: Yup.string()
            .required('E-mail Obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha Obrigatória')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await api.post('/users', data)

        addToast({
          type: 'success',
          title: 'Cadastro realizado com sucesso',
          description: 'Você já pode realizar seu logon no Gobarber'
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
          title: 'Erro na Authenticação',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente'
        })
      }
    },
    [addToast, history]
  )
  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Faça seu Cadastro</h1>
            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft size={20} />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  )
}

export default SignUp
