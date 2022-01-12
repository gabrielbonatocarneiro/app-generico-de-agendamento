import React from "react"
import styled from "styled-components"

import StarFull from '../assets/star.svg'
import StarHalf from '../assets/star_half.svg'
import StarEmpty from '../assets/star_empty.svg'

const StarArea = styled.View`
  flex-direction: row;
`
const StarView = styled.View``
const StartText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  margin-left: 5px;
  color: #737373;
`

export default ({ stars, showNumber }) => {
  // 0 -> Empty, 1 -> Half, 2 -> Full
  let listStar = [0, 0, 0, 0, 0]

  const intStart = Math.floor(stars)
  const numberAfterDot = stars - intStart

  // Preenchemos as estrelas douradas com o valor inteiro
  for (let i = 0; i < intStart; i++) {
    listStar[i] = 2
  }

  // O número após o inteiro colocamos no a estrela pela metade
  if (numberAfterDot > 0) {
    listStar[intStart] = 1
  }

  return (
    <StarArea>
      {listStar.map((s, index) => (
        <StarView key={index}>
          {s === 0 && <StarEmpty width="18" height="18" fill="#FF9200" />}
          {s === 1 && <StarHalf width="18" height="18" fill="#FF9200" />}
          {s === 2 && <StarFull width="18" height="18" fill="#FF9200" />}
        </StarView>
      ))}

      {showNumber && <StartText>{stars}</StartText>}
    </StarArea>
  )
}