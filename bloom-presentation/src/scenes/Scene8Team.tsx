import React from "react";
import { SlideShell } from "../components/SlideShell";
import { Orb } from "../components/Orb";
import { FadeUp, ExpandLine } from "../components/FadeUp";
import { Eyebrow } from "../components/Typography";
import { TeamMember } from "../components/Cards";
import { colors, fonts } from "../theme";

export const Scene8Team: React.FC = () => {
  return (
    <SlideShell
      label="Thank You"
      orbs={
        <>
          <Orb color="rgba(124,185,168,0.18)" size={560} top={-90} right={200} periodSeconds={16} phase={1} />
          <Orb color="rgba(232,184,109,0.22)" size={580} bottom={-160} left={100} periodSeconds={13} />
        </>
      }
    >
      <FadeUp delayFrames={4}>
        <Eyebrow>NJx Hackathon · June 2026</Eyebrow>
      </FadeUp>

      <FadeUp delayFrames={12} durationFrames={22}>
        <div
          style={{
            fontFamily: fonts.serif,
            fontSize: 88,
            fontWeight: 300,
            fontStyle: "italic",
            color: colors.cream,
            lineHeight: 1.08,
            marginTop: 24,
          }}
        >
          Building for the
          <br />
          <span style={{ color: colors.gold, fontWeight: 600, fontStyle: "normal" }}>6.9 million.</span>
        </div>
      </FadeUp>

      <ExpandLine delayFrames={36} color={colors.gold} style={{ marginTop: 44 }} />

      <div style={{ display: "flex", gap: 20, marginTop: 32 }}>
        <TeamMember name="Team Member" role="Role" delayFrames={42} />
        <TeamMember name="Team Member" role="Role" delayFrames={48} />
        <TeamMember name="Team Member" role="Role" delayFrames={54} />
        <TeamMember name="Team Member" role="Role" delayFrames={60} />
      </div>

      <FadeUp delayFrames={70}>
        <p
          style={{
            marginTop: 28,
            fontFamily: fonts.sans,
            fontSize: 16,
            color: colors.cream40,
          }}
        >
          bloom — improving the quality of life for every Alzheimer&apos;s patient, one day at a time.
        </p>
      </FadeUp>
    </SlideShell>
  );
};
