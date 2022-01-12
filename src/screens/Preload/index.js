import React, { useEffect, useContext } from "react"
import { Container, LoadingIcon } from './styles'
import AsyncStorage from '@react-native-community/async-storage'
import { useNavigation } from "@react-navigation/native"
import { UserContext } from '../../contexts/UserContext'

import Api from "../../Api"

import BarberLogo from '../../assets/barber.svg'

export default () => {
  // Dispatch para salvar o avatar o usuário
  const { dispatch: userDispatch } = useContext(UserContext)

  // Inicializamos o navigation
  const navigation = useNavigation()

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token')

      // Validamos se tem o token do async storage
      if (!token) {
        return navigation.navigate('SignIn')
      }

      const res = await Api.checkToken(token)

      // Validamos se retornou o token da api
      if (!res || !res.token) {
        return navigation.navigate('SignIn')
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

    checkToken()
  }, [])

  return (
    <Container>
      <BarberLogo width="80%" paddingLeft="10%" paddingRight="10%" />
      <LoadingIcon size="large" color="#FFFFFF" />
    </Container>
  )
}