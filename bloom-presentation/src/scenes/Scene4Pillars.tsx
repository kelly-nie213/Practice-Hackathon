import React from "react";
import { SlideShell } from "../components/SlideShell";
import { Orb } from "../components/Orb";
import { FadeUp } from "../components/FadeUp";
import { Eyebrow, H2, Strong } from "../components/Typography";
import { Pillar } from "../components/Cards";

export const Scene4Pillars: React.FC = () => {
  return (
    <SlideShell
      label="Core Features"
      orbs={
        <>
          <Orb color="rgba(155,137,196,0.18)" size={600} top={60} right={-140} periodSeconds={14} phase={1} />
          <Orb color="rgba(224,122,95,0.18)" size={520} bottom={-110} left={100} periodSeconds={11} phase={2} />
        </>
      }
    >
      <FadeUp delayFrames={4}>
        <Eyebrow>Four Pillars</Eyebrow>
      </FadeUp>
      <FadeUp delayFrames={10} durationFrames={20}>
        <H2>
          Everything a patient <Strong>needs</Strong>
        </H2>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 8 }}>
        <Pillar
          icon="🧠"
          title="Memory Assistance"
          desc="Childhood music playlists, family photo recognition, AI storytelling narrated aloud, “Who Am I” daily facts, and memory prompts through guided questions."
          delayFrames={26}
        />
        <Pillar
          icon="🌅"
          title="Daily Living Support"
          desc="Morning & bedtime checklists, calendar routines, a daily orientation screen showing date, weather, and a family photo — grounding patients in the present."
          delayFrames={38}
        />
        <Pillar
          icon="🛡"
          title="Safety Reminders"
          desc="Medication reminders, an “I'm Lost” button that shares GPS location with caregivers, one-tap family calls, and a map of home and favorite places."
          delayFrames={50}
        />
        <Pillar
          icon="🎯"
          title="Cognitive Training"
          desc="Crosswords, number puzzles, card games, daily balance exercises, and voice-journal reflection with AI keyword identification — all rewarded with coins."
          delayFrames={62}
        />
      </div>
    </SlideShell>
  );
};
