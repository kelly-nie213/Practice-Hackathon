import React from "react";
import { colors, fonts } from "../theme";
import { FadeUp } from "./FadeUp";

export const StatCard: React.FC<{ number: string; label: string; delayFrames: number }> = ({
  number,
  label,
  delayFrames,
}) => (
  <FadeUp delayFrames={delayFrames} style={{ flex: 1 }}>
    <div
      style={{
        background: colors.cream10,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: "32px 28px",
        height: "100%",
      }}
    >
      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: 62,
          fontWeight: 600,
          color: colors.gold,
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        {number}
      </div>
      <div style={{ fontFamily: fonts.sans, fontSize: 16, fontWeight: 300, color: colors.cream60, lineHeight: 1.55 }}>
        {label}
      </div>
    </div>
  </FadeUp>
);

export const Pillar: React.FC<{
  icon: string;
  title: string;
  desc: string;
  delayFrames: number;
}> = ({ icon, title, desc, delayFrames }) => (
  <FadeUp delayFrames={delayFrames}>
    <div
      style={{
        background: colors.cream10,
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        padding: "34px 30px",
        height: "100%",
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontFamily: fonts.serif, fontSize: 27, fontWeight: 500, color: colors.cream, marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, color: colors.cream40, lineHeight: 1.6 }}>
        {desc}
      </div>
    </div>
  </FadeUp>
);

export const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: colors.goldDim,
      border: `1px solid ${colors.goldBorder}`,
      borderRadius: 100,
      padding: "8px 20px",
      fontFamily: fonts.sans,
      fontSize: 15,
      color: colors.gold,
    }}
  >
    {children}
  </div>
);

export const ChipRow: React.FC<{ children: React.ReactNode; delayFrames: number; justify?: string }> = ({
  children,
  delayFrames,
  justify = "flex-start",
}) => (
  <FadeUp delayFrames={delayFrames}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: justify }}>{children}</div>
  </FadeUp>
);

export const FeatureList: React.FC<{ items: string[]; delayFrames: number; stagger?: number }> = ({
  items,
  delayFrames,
  stagger = 5,
}) => (
  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, margin: 0, padding: 0 }}>
    {items.map((item, i) => (
      <FadeUp key={item} delayFrames={delayFrames + i * stagger} durationFrames={14}>
        <li
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            fontFamily: fonts.sans,
            fontSize: 19,
            fontWeight: 300,
            color: colors.cream60,
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: colors.gold, flexShrink: 0 }}>—</span>
          <span>{item}</span>
        </li>
      </FadeUp>
    ))}
  </ul>
);

export const Quote: React.FC<{ children: React.ReactNode; delayFrames: number }> = ({ children, delayFrames }) => (
  <FadeUp delayFrames={delayFrames}>
    <div
      style={{
        fontFamily: fonts.serif,
        fontSize: 32,
        fontWeight: 300,
        fontStyle: "italic",
        color: colors.cream,
        lineHeight: 1.42,
        borderLeft: `3px solid ${colors.coral}`,
        paddingLeft: 28,
        marginTop: 40,
      }}
    >
      {children}
    </div>
  </FadeUp>
);

export const SafetyBox: React.FC<{ title: string; children: React.ReactNode; delayFrames: number }> = ({
  title,
  children,
  delayFrames,
}) => (
  <FadeUp delayFrames={delayFrames}>
    <div
      style={{
        background: colors.coralDim,
        border: `1px solid ${colors.coralBorder}`,
        borderRadius: 18,
        padding: "30px 28px",
        marginBottom: 24,
      }}
    >
      <div style={{ fontFamily: fonts.serif, fontSize: 26, fontWeight: 500, color: colors.coral, marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ fontFamily: fonts.sans, fontSize: 17, fontWeight: 300, color: colors.cream60, lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  </FadeUp>
);

export const TeamMember: React.FC<{ name: string; role: string; delayFrames: number }> = ({
  name,
  role,
  delayFrames,
}) => (
  <FadeUp delayFrames={delayFrames} style={{ flex: 1 }}>
    <div
      style={{
        background: colors.cream10,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: "22px 24px",
      }}
    >
      <div style={{ fontFamily: fonts.serif, fontSize: 22, fontWeight: 500, color: colors.cream, marginBottom: 4 }}>
        {name}
      </div>
      <div style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: colors.cream40 }}>{role}</div>
    </div>
  </FadeUp>
);
