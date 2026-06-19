import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SlideShell } from "../components/SlideShell";
import { Orb } from "../components/Orb";
import { FadeUp } from "../components/FadeUp";
import { Eyebrow, H2, Strong, ColLabel, Paragraph } from "../components/Typography";
import { FeatureList, Chip } from "../components/Cards";
import { colors, fonts } from "../theme";

const FloatingCoin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const angle = (t / 3) * Math.PI * 2;
  const y = Math.sin(angle) * 12;
  const rotate = Math.sin(angle) * 3;

  return (
    <div
      style={{
        fontSize: 84,
        marginBottom: 16,
        transform: `translateY(${y}px) rotate(${rotate}deg)`,
        display: "inline-block",
      }}
    >
      🪙
    </div>
  );
};

export const Scene7Rewards: React.FC = () => {
  return (
    <SlideShell
      label="Engagement System"
      orbs={
        <>
          <Orb color="rgba(232,184,109,0.22)" size={580} top={80} right={100} periodSeconds={13} />
          <Orb color="rgba(124,185,168,0.18)" size={560} bottom={-110} left={-90} periodSeconds={16} phase={1} />
        </>
      }
    >
      <FadeUp delayFrames={4}>
        <Eyebrow>The Key to Consistency</Eyebrow>
      </FadeUp>
      <FadeUp delayFrames={10} durationFrames={20}>
        <H2>
          Earn coins. <Strong>Stay engaged.</Strong>
        </H2>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 64, marginTop: 16, alignItems: "center" }}>
        <div>
          <FadeUp delayFrames={26}>
            <Paragraph style={{ fontSize: 20, marginBottom: 28 }}>
              Consistency is the core challenge in managing Alzheimer&apos;s progression. Bloom&apos;s rewards
              system turns daily tasks into a motivating game — without oversimplifying or infantilizing.
            </Paragraph>
          </FadeUp>
          <FadeUp delayFrames={38}>
            <ColLabel color={colors.gold}>Earn Coins For</ColLabel>
          </FadeUp>
          <FeatureList
            delayFrames={44}
            items={[
              "Completing morning & bedtime checklists",
              "Finishing cognitive training sessions",
              "Recording a daily reflection",
              "Taking medication on time",
              "Completing the daily exercise",
            ]}
          />
        </div>

        <FadeUp delayFrames={40}>
          <div
            style={{
              background: "linear-gradient(140deg, rgba(232,184,109,0.14), rgba(232,184,109,0.04))",
              border: `1px solid ${colors.goldBorder}`,
              borderRadius: 28,
              padding: "56px 44px",
              textAlign: "center",
            }}
          >
            <FloatingCoin />
            <div style={{ fontFamily: fonts.serif, fontSize: 64, color: colors.gold, fontWeight: 600, lineHeight: 1 }}>
              250
            </div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 16,
                color: colors.cream40,
                margin: "10px 0 30px",
                letterSpacing: "0.06em",
              }}
            >
              coins earned today
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Chip>✨ Redeem Rewards</Chip>
            </div>
          </div>
        </FadeUp>
      </div>
    </SlideShell>
  );
};
