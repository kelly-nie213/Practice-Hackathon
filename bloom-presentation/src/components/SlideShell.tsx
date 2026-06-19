import React from "react";
import { AbsoluteFill } from "remotion";
import { colors, fonts } from "../theme";

interface SlideShellProps {
  children: React.ReactNode;
  label: string;
  orbs?: React.ReactNode;
}

// Mirrors `.slide` + `.slide-header` from the original deck: background,
// padding, noise grain, logo, and the per-slide label in the top corner.
export const SlideShell: React.FC<SlideShellProps> = ({ children, label, orbs }) => {
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {orbs}
      <AbsoluteFill
        style={{
          flexDirection: "column",
          padding: "72px 108px 120px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 60,
            position: "relative",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: fonts.serif,
              fontSize: 28,
              fontStyle: "italic",
              color: colors.gold,
              letterSpacing: "0.03em",
            }}
          >
            bloom
          </span>
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: colors.cream40,
            }}
          >
            {label}
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
