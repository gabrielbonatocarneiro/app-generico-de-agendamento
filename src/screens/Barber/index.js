import React, { useState, useEffect } from "react"
import { useNavigation, useRoute } from '@react-navigation/native'
import Swiper from "react-native-swiper"

import Stars from '../../components/Stars'
import BarberModal from '../../components/BarberModal'

import FavoriteIcon from '../../assets/favorite.svg'
import FavoriteFullIcon from '../../assets/favorite_full.svg'
import BackIcon from '../../assets/back.svg'
import NavPrevIcon from '../../assets/nav_prev.svg'
import NavNextIcon from '../../assets/nav_next.svg'

import {
  Container,
  Scroller,

  SwipeDot,
  SwipeDotActive,
  SwipeItem,
  SwipeImage,
  FakeSwiper,

  PageBody,

  UserInfoArea,
  UserAvatar,
  UserInfo,
  UserInfoName,
  UserFavButton,

  LoadingIcon,

  ServiceArea,
  ServicesTitle,
  ServiceItem,
  ServiceInfo,
  ServiceName,
  ServicePrice,
  ServiceChooseButton,
  ServiceChooseBtnText,

  TestimonialArea,
  TestimonialItem,
  TestimonialInfo,
  TestimonialName,
  TestimonialBody,

  BackButton
} from './styles'

import Api from "../../Api"

export default () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [userInfo, setUserInfo] = useState({
    id: route.params.id,
    avatar: route.params.avatar,
    name: route.params.name,
    stars: route.params.stars
  })
  const [loading, setLoading] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const getBarberInfo = async () => {
      setLoading(true)

      const res = await Api.getBarber(userInfo.id)

      if (res.error) {
        return alert("Erro: " + res.error)
      }

      setUserInfo(res.data)
      setFavorited(res.data.favorited)

      setLoading(false)
    }

    getBarberInfo()
  }, [])

  const handleBackButton = () => {
    navigation.goBack()
  }

  const handleFavClick = async () => {
    const res = await Api.setFavorite(userInfo.id)

    if (res.error) {
      return alert("Erro: " + res.error)
    }

    setFavorited(res.have)
  }

  const handleServiceChoose = async (index) => {
    setSelectedService(index)
    setShowModal(true)
  }

  return (
    <Container>
      <Scroller>
        {userInfo.photos && userInfo.photos.length > 0 ?
          <Swiper
            style={{ height: 240 }}
            dot={<SwipeDot />}
            activeDot={<SwipeDotActive />}
            paginationStyle={{ top: 15, right: 15, bottom: null, left: null }}
            autoplay={true}
          >
            {userInfo.photos.map((item, index) => (
              <SwipeItem key={index}>
                <SwipeImage source={{ uri: item.url }} resizeMode="cover" />
              </SwipeItem>
            ))}
          </Swiper>
          :
          <FakeSwiper>

          </FakeSwiper>
        }

        <PageBody>
          <UserInfoArea>
            <UserAvatar source={{ uri: userInfo.avatar }} />

            <UserInfo>
              <UserInfoName>{userInfo.name}</UserInfoName>
              <Stars stars={userInfo.stars} showNumber={true} />
            </UserInfo>

            <UserFavButton onPress={handleFavClick}>
              {favorited ?
                <FavoriteFullIcon width="24" height="24" fill="#FF0000" />
                :
                <FavoriteIcon width="24" height="24" fill="#FF0000" />
              }
            </UserFavButton>
          </UserInfoArea>

          {loading &&
            <LoadingIcon size="large" color="#000000" />
          }

          {userInfo.services && userInfo.services.length > 0 &&
            <ServiceArea>
              <ServicesTitle>Lista de serviços</ServicesTitle>

              {userInfo.services.map((item, index) => (
                <ServiceItem key={index}>
                  <ServiceInfo>
                    <ServiceName>{item.name}</ServiceName>
                    <ServicePrice>R$ {item.price.toFixed(2)}</ServicePrice>
                  </ServiceInfo>

                  <ServiceChooseButton onPress={() => handleServiceChoose(index)}>
                    <ServiceChooseBtnText>Agendar</ServiceChooseBtnText>
                  </ServiceChooseButton>
                </ServiceItem>
              ))}
            </ServiceArea>
          }

          {userInfo.testimonials && userInfo.testimonials.length > 0 &&
            <TestimonialArea>
              <Swiper
                style={{ height: 110 }}
                showsPagination={false}
                showsButtons={true}
                prevButton={<NavPrevIcon width="35" height="35" fill="#000000" />}
                nextButton={<NavNextIcon width="35" height="35" fill="#000000" />}
              >
                {userInfo.testimonials.map((item, index) => (
                  <TestimonialItem key={index}>
                    <TestimonialInfo>
                      <TestimonialName>{item.name}</TestimonialName>
                      <Stars stars={item.rate} showNumber={false}></Stars>
                    </TestimonialInfo>

                    <TestimonialBody>{item.body}</TestimonialBody>
                  </TestimonialItem>
                ))}
              </Swiper>
            </TestimonialArea>
          }
        </PageBody>
      </Scroller>

      <BackButton onPress={handleBackButton}>
        <BackIcon width="44" height="44" fill="#FFFFFF" />
      </BackButton>

      <BarberModal
        show={showModal}
        setShow={setShowModal}
        user={userInfo}
        indexService={selectedService}
      />
    </Container>
  )
}