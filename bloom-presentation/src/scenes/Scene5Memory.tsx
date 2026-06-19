import React from "react";
import { SlideShell } from "../components/SlideShell";
import { Orb } from "../components/Orb";
import { FadeUp } from "../components/FadeUp";
import { Eyebrow, H2, Strong, ColLabel } from "../components/Typography";
import { FeatureList } from "../components/Cards";

export const Scene5Memory: React.FC = () => {
  return (
    <SlideShell
      label="Memory & Cognition"
      orbs={
        <>
          <Orb color="rgba(232,184,109,0.22)" size={580} top={-180} left={180} periodSeconds={13} />
          <Orb color="rgba(124,185,168,0.18)" size={560} bottom={40} right={-140} periodSeconds={16} phase={1} />
        </>
      }
    >
      <FadeUp delayFrames={4}>
        <Eyebrow>Triggering Memories, Training the Mind</Eyebrow>
      </FadeUp>
      <FadeUp delayFrames={10} durationFrames={20}>
        <H2>
          The science of <Strong>remembering</Strong>
        </H2>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginTop: 16 }}>
        <div>
          <FadeUp delayFrames={26}>
            <ColLabel>Memory Triggers</ColLabel>
          </FadeUp>
          <FeatureList
            delayFrames={32}
            items={[
              "Music from the patient's childhood playlist",
              "Family photo recognition — names, traits, relationships",
              "AI reads family stories aloud via text-to-speech",
              "Daily “Who Am I” — personal facts and affirmations",
              "Prompted memory questions to surface recollections",
              "Daily reflection journal with voice input",
            ]}
          />
        </div>
        <div>
          <FadeUp delayFrames={38}>
            <ColLabel>Cognitive Training</ColLabel>
          </FadeUp>
          <FeatureList
            delayFrames={44}
            items={[
              "Crossword puzzles with adaptive difficulty",
              "Sudoku and number games",
              "Card and board games",
              "Daily exercise — balance, movement, coordination",
              "AI identifies key themes from voice journals",
              "Every session earns coins in the rewards system",
            ]}
          />
        </div>
      </div>
    </SlideShell>
  );
};
