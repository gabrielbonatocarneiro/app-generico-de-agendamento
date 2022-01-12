import React, { useState, useContext } from "react"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-community/async-storage"
import { UserContext } from '../../contexts/UserContext'

import {
  Container,
  InputArea,
  CustomButton,
  CustomButtonText,
  SignMessageButton,
  SignMessageButtonText,
  SignMessageButtonTextBold
} from './styles'

import Api from "../../Api"

import SignInput from "../../components/SignInput"

import BarberLogo from '../../assets/barber.svg'
import EmailIcon from '../../assets/email.svg'
import LockIcon from '../../assets/lock.svg'

export default () => {
  // Dispatch para salvar o avatar o usuário
  const { dispatch: userDispatch } = useContext(UserContext)

  // Inicializamos o navigation
  const navigation = useNavigation()

  // Fazemos o states das variáveis
  const [emailField, setEmailField] = useState('')
  const [passwordField, setPasswordField] = useState('')

  const handleSignClick = async () => {
    if (!emailField || !passwordField) {
      return alert("Preencha os campos!")
    }

    const res = await Api.signIn(emailField, passwordField)

    // Validamos se retornou o token da api
    if (!res || !res.token) {
      return alert('E-mail e/ou senha errados!')
    }

    await AsyncStorage.setItem('token', res.token)

    // Salvamos o avatar o usuário
    userDispatch({
      type: 'setAvatar',
      payload: {
        avatar: res.data.avatar
      }
    })

    // direcionamos o usuario pra tela home quanto ele já está logado
    navigation.reset({
      routes: [{ name: 'MainTab' }]
    })
  }

  // direcionamos o usuario pra tela SingUp para fazer o cadastro
  const handleMessageButtonClick = () => {
    navigation.reset({
      routes: [{ name: 'SignUp' }]
    })
  }

  return (
    <Container>
      <BarberLogo width="80%" height="30%" paddingLeft="10%" paddingRight="10%" />

      <InputArea>
        <SignInput
          IconSvg={EmailIcon}
          placeholder="Digite seu e-mail"
          value={emailField}
          onChangeText={t => setEmailField(t)}
        />

        <SignInput
          IconSvg={LockIcon}
          placeholder="Digite sua senha"
          value={passwordField}
          onChangeText={t => setPasswordField(t)}
          password={true}
        />

        <CustomButton onPress={handleSignClick}>
          <CustomButtonText>LOGIN</CustomButtonText>
        </CustomButton>
      </InputArea>

      <SignMessageButton onPress={handleMessageButtonClick}>
        <SignMessageButtonText>Ainda não possui uma conta?</SignMessageButtonText>
        <SignMessageButtonTextBold>Cadastre-se</SignMessageButtonTextBold>
      </SignMessageButton>
    </Container>
  )
}