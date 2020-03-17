import React from 'react';

import { Container, Image } from './styles';
import loading from '../../assets/loading-2.png'
export default function Loading() {
  return (
    <Container>
        <Image src={loading} />
    </Container>
  );
}
