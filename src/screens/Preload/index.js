import React from "react";
import { Container, LoadingIcon } from './styles';

import BarberLogo from '../../assets/barber.svg';

export default () => {
  return (
    <Container>
      <BarberLogo width="80%" paddingLeft="10%" paddingRight="10%" />
      <LoadingIcon size="large" color="#FFFFFF" />
    </Container>
  );
}