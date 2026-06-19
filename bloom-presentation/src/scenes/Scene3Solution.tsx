import React from "react";
import { SlideShell } from "../components/SlideShell";
import { Orb } from "../components/Orb";
import { FadeUp } from "../components/FadeUp";
import { Eyebrow, H2, Strong, ColLabel, Paragraph } from "../components/Typography";
import { Chip, ChipRow } from "../components/Cards";
import { colors } from "../theme";

export const Scene3Solution: React.FC = () => {
  return (
    <SlideShell
      label="The Solution"
      orbs={
        <>
          <Orb color="rgba(124,185,168,0.18)" size={580} top={-120} left={-160} periodSeconds={16} phase={1} />
          <Orb color="rgba(232,184,109,0.22)" size={620} bottom={-190} right={80} periodSeconds={13} />
        </>
      }
    >
      <FadeUp delayFrames={4}>
        <Eyebrow>What We Built</Eyebrow>
      </FadeUp>
      <FadeUp delayFrames={10} durationFrames={20}>
        <H2>
          An AI companion that <Strong>adapts</Strong> to each patient
        </H2>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginTop: 16 }}>
        <FadeUp delayFrames={28}>
          <div>
            <ColLabel color={colors.teal}>Voice-First by Design</ColLabel>
            <Paragraph>
              Every feature is fully operable by voice — no typing, no complex navigation. Text-to-speech reads
              everything aloud, removing barriers for users with motor impairment or cognitive difficulty.
            </Paragraph>
          </div>
        </FadeUp>
        <FadeUp delayFrames={40}>
          <div>
            <ColLabel color={colors.coral}>Rewards-Driven Engagement</ColLabel>
            <Paragraph>
              Alzheimer&apos;s patients struggle with consistency — the core challenge in slowing progression.
              Bloom&apos;s coin system creates intrinsic motivation: complete tasks, earn coins, redeem for
              meaningful rewards.
            </Paragraph>
          </div>
        </FadeUp>
      </div>

      <ChipRow delayFrames={58}>
        <Chip>🎙 Voice Navigation</Chip>
        <Chip>🔊 Text-to-Speech</Chip>
        <Chip>🪙 Coin Rewards</Chip>
        <Chip>🤖 AI-Powered</Chip>
        <Chip>👨‍👩‍👧 Family Connected</Chip>
        <Chip>🎯 Target: Early-Stage</Chip>
      </ChipRow>
    </SlideShell>
  );
};
