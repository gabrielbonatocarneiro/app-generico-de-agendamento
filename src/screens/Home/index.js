import React, { useState, useEffect } from "react"
import { Platform, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { request, PERMISSIONS } from 'react-native-permissions'
import Geolocation from '@react-native-community/geolocation'

import {
  Container,
  Scroller,

  HeaderArea,
  HeaderTitle,
  SearchButton,

  LocationArea,
  LocationInput,
  LocationFinder,

  LoadingIcon,
  ListArea
} from './styles'

import Api from "../../Api"

import BarberItem from '../../components/BarberItem'

import SearchIcon from '../../assets/search.svg'
import MyLocationIcon from '../../assets/my_location.svg'

export default () => {
  const navigation = useNavigation()

  const [locationText, setLocationText] = useState('')
  const [coords, setCoords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [listBarbers, setListBarbers] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const handleLocationFinder = async () => {
    // Zeramos as coordenadas que já existem
    setCoords(null)

    // Pedimos a permissão
    const result = await request(
      Platform.OS === 'ios' ?
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        :
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );

    if (result == 'granted') {
      // Ativamos o loading
      setLoading(true)

      // Apagamos o que estiver escrito no campo
      setLocationText('')

      // Zeramos a lista de barbeiros
      setListBarbers([])

      Geolocation.getCurrentPosition((info) => {
        setCoords(info.coords)
        getBarbers()
      })
    }
  }

  const getBarbers = async () => {
    setLoading(true)
    setListBarbers([])

    let latitude = null
    let longitude = null

    if (coords) {
      latitude = coords.latitude
      longitude = coords.longitude
    }

    const res = await Api.getBarbers(latitude, longitude, locationText)

    if (!res || res.error != "") {
      alert("Erro: " + res.error)
      return setLoading(false)
    }

    if (res.loc) {
      setLocationText(res.loc)
    }

    setListBarbers(res.data)
    setLoading(false)
  }

  useEffect(() => {
    getBarbers()
  }, [])

  const onRefresh = () => {
    setRefreshing(false)
    getBarbers()
  }

  const handleLocationSearch = () => {
    setCoords(null)
    getBarbers()
  }

  return (
    <Container>
      <Scroller refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <HeaderArea>
          <HeaderTitle numberOfLines={2}>Encontre o seu barbeiro favorito</HeaderTitle>

          <SearchButton onPress={() => navigation.navigate('Search')}>
            <SearchIcon width="26" height="26" fill="#FFFFFF" />
          </SearchButton>
        </HeaderArea>

        <LocationArea>
          <LocationInput
            placeholder="Onde você está?"
            placeholderTextColor="#FFFFFF"
            value={locationText}
            onChangeText={t => setLocationText(t)}
            onEndEditing={handleLocationSearch}
          />

          <LocationFinder onPress={handleLocationFinder}>
            <MyLocationIcon width="24" height="24" fill="#FFFFFF" />
          </LocationFinder>
        </LocationArea>

        {loading &&
          <LoadingIcon size="large" color="#FFFFFF" />
        }

        <ListArea>
          {listBarbers.map((item, index) => (
            <BarberItem key={index} data={item} />
          ))}
        </ListArea>
      </Scroller>
    </Container>
  )
}