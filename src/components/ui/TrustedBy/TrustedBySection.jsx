// src/App.jsx
import React from 'react';
import workDomain from "@assets/images/Working-Domain/workdomain.svg";
import tp1 from "@assets/images/TP/tp1.svg";
import tp2 from '@assets/images/TP/tp2.svg';
import tp3 from '@assets/images/TP/tp3.svg';
import tp4 from '@assets/images/TP/tp4.svg';
import tp5 from '@assets/images/TP/tp5.svg';
import { TrustedBy } from './TrustedBy';

const logos = [
  { src: tp1, alt: 'Client 1' },
  { src: tp2, alt: 'Client 2' },
  { src: tp3, alt: 'Client 3' },
  { src: tp4, alt: 'Client 4' },
  { src: tp5, alt: 'Client 5' },
];

function TrustedBySection() {
  return (
    <div>
      <TrustedBy logos={logos} />
    </div>
  );
}

export default TrustedBySection;
