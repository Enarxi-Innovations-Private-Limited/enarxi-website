// src/components/FeaturesSection.jsx
import React from 'react';
import bulb from "@assets/icons/bulb.svg";
import cpu from "@assets/icons/cpu.svg";
import run from "@assets/icons/run.svg";
import wallet from "@assets/icons/wallet.svg";
import Scissors from "@assets/icons/scissors.svg";
import badge from "@assets/icons/badge.svg";

import { FeatureCard } from './FeatureCard';

const features = [
  { icon: bulb, title: 'Innovative' },
  { icon: run, title: 'Faster build time' },
  { icon: badge, title: 'Reliable' },
  { icon: cpu, title: 'Industrial grade designs' },
  { icon: wallet, title: 'Cost effective solutions' },
  { icon: Scissors, title: 'Value engineering' },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => (
            <FeatureCard key={feat.title} icon={feat.icon} title={feat.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
