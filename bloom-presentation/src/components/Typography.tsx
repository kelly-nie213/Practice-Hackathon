import React from "react";
import { colors, fonts } from "../theme";

export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: "0.20em",
      textTransform: "uppercase",
      color: colors.gold,
      marginBottom: 24,
      ...style,
    }}
  >
    {children}
  </div>
);

export const DisplayTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: fonts.serif,
      fontSize: 196,
      fontWeight: 300,
      fontStyle: "italic",
      lineHeight: 0.88,
      color: colors.cream,
      letterSpacing: "-0.02em",
      marginBottom: 28,
    }}
  >
    {children}
  </div>
);

export const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: fonts.serif,
      fontSize: 76,
      fontWeight: 300,
      fontStyle: "italic",
      lineHeight: 1.1,
      color: colors.cream,
      marginBottom: 48,
    }}
  >
    {children}
  </div>
);

export const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontWeight: 600, fontStyle: "normal", color: colors.gold }}>{children}</span>
);

export const Tagline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: fonts.serif,
      fontSize: 38,
      fontWeight: 300,
      fontStyle: "italic",
      color: colors.gold,
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);

export const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontSize: 20,
      fontWeight: 300,
      color: colors.cream40,
      letterSpacing: "0.06em",
    }}
  >
    {children}
  </div>
);

export const Paragraph: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <p
    style={{
      fontFamily: fonts.sans,
      fontSize: 19,
      fontWeight: 300,
      lineHeight: 1.72,
      color: colors.cream60,
      margin: 0,
      ...style,
    }}
  >
    {children}
  </p>
);

export const ColLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = colors.teal,
}) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color,
      marginBottom: 20,
    }}
  >
    {children}
  </div>
);
