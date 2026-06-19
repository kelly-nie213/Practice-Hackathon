import React from "react";
import { SlideShell } from "../components/SlideShell";
import { Orb } from "../components/Orb";
import { FadeUp, ExpandLine } from "../components/FadeUp";
import { Eyebrow, DisplayTitle, Tagline, Subtitle } from "../components/Typography";
import { colors } from "../theme";

export const Scene1Title: React.FC = () => {
  return (
    <SlideShell
      label="NJx Hackathon · June 2026"
      orbs={
        <>
          <Orb color="rgba(232,184,109,0.22)" size={680} top={-260} right={-100} periodSeconds={13} />
          <Orb color="rgba(124,185,168,0.18)" size={580} bottom={-240} left={-120} periodSeconds={16} phase={2} />
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <FadeUp delayFrames={6}>
          <Eyebrow>Introducing</Eyebrow>
        </FadeUp>
        <FadeUp delayFrames={12} durationFrames={22}>
          <DisplayTitle>Bloom</DisplayTitle>
        </FadeUp>
        <ExpandLine delayFrames={26} color={colors.gold} centered />
        <FadeUp delayFrames={32}>
          <Tagline>Your mind, remembered.</Tagline>
        </FadeUp>
        <FadeUp delayFrames={40}>
          <Subtitle>An AI companion for early-stage Alzheimer&apos;s patients</Subtitle>
        </FadeUp>
      </div>
    </SlideShell>
  );
};
