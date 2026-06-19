import React from "react";
import { SlideShell } from "../components/SlideShell";
import { Orb } from "../components/Orb";
import { FadeUp } from "../components/FadeUp";
import { Eyebrow, H2, Strong } from "../components/Typography";
import { StatCard, Quote } from "../components/Cards";

export const Scene2Problem: React.FC = () => {
  return (
    <SlideShell
      label="The Problem"
      orbs={
        <>
          <Orb color="rgba(224,122,95,0.18)" size={560} top={-160} right={140} periodSeconds={11} phase={2} />
          <Orb color="rgba(155,137,196,0.18)" size={640} bottom={-150} left={180} periodSeconds={14} phase={1} />
        </>
      }
    >
      <FadeUp delayFrames={4}>
        <Eyebrow>The Challenge</Eyebrow>
      </FadeUp>
      <FadeUp delayFrames={10} durationFrames={20}>
        <H2>
          Memory loss steals <Strong>independence</Strong>
        </H2>
      </FadeUp>

      <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
        <StatCard number="6.9M" label="Americans currently living with Alzheimer's disease" delayFrames={26} />
        <StatCard number="1 in 3" label="Seniors who die with Alzheimer's or another dementia" delayFrames={36} />
        <StatCard number="18B+" label="Hours of unpaid caregiver time provided each year" delayFrames={46} />
      </div>

      <Quote delayFrames={64}>
        &ldquo;Existing tools are built for caregivers.
        <br />
        We built Bloom <em>for the patient.</em>&rdquo;
      </Quote>
    </SlideShell>
  );
};
