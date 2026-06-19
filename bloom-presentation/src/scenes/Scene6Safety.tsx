import React from "react";
import { SlideShell } from "../components/SlideShell";
import { Orb } from "../components/Orb";
import { FadeUp } from "../components/FadeUp";
import { Eyebrow, H2, Strong, ColLabel } from "../components/Typography";
import { FeatureList, SafetyBox } from "../components/Cards";
import { colors } from "../theme";

export const Scene6Safety: React.FC = () => {
  return (
    <SlideShell
      label="Safety & Daily Life"
      orbs={
        <>
          <Orb color="rgba(224,122,95,0.18)" size={520} top={0} right={-60} periodSeconds={11} phase={2} />
          <Orb color="rgba(155,137,196,0.18)" size={620} bottom={-170} left={160} periodSeconds={14} phase={1} />
        </>
      }
    >
      <FadeUp delayFrames={4}>
        <Eyebrow>Staying Safe, Staying Independent</Eyebrow>
      </FadeUp>
      <FadeUp delayFrames={10} durationFrames={20}>
        <H2>
          Peace of mind for <Strong>everyone</Strong>
        </H2>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginTop: 16 }}>
        <div>
          <SafetyBox title="🆘  “I'm Lost” Button" delayFrames={26}>
            One tap sends real-time GPS location to all family members and caregivers — instantly, silently,
            reliably.
          </SafetyBox>
          <FeatureList
            delayFrames={40}
            items={[
              "Medication reminders with confirmation prompts",
              "Map showing current location, home, and favorites",
              "One-tap buttons to call family members by name",
            ]}
          />
        </div>
        <div>
          <FadeUp delayFrames={32}>
            <ColLabel color={colors.coral}>Daily Routine</ColLabel>
          </FadeUp>
          <FeatureList
            delayFrames={38}
            items={[
              "Morning & bedtime checklists with voice guidance",
              "Calendar events that enforce a strict daily routine",
              "Orientation screen: date, weather, family photo",
              "“Who Am I” — daily reminders of facts about themselves",
              "Daily affirmations and motivational messages",
              "Exercise of the day for physical wellness",
            ]}
          />
        </div>
      </div>
    </SlideShell>
  );
};
