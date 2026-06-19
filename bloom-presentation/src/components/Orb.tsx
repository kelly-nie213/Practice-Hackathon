import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface OrbProps {
  color: string;
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  periodSeconds?: number;
  phase?: number;
}

// Replaces the CSS `float1`/`float2` keyframe animations with a continuous
// sine-driven drift, since CSS animations don't render correctly in Remotion.
export const Orb: React.FC<OrbProps> = ({
  color,
  size,
  top,
  bottom,
  left,
  right,
  periodSeconds = 13,
  phase = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  const angle = (t / periodSeconds) * Math.PI * 2;

  const x = Math.sin(angle) * 24;
  const y = Math.cos(angle * 1.3) * 20;
  const scale = 1 + Math.sin(angle * 0.8) * 0.04;

  return (
    <div
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(110px)",
        pointerEvents: "none",
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
      }}
    />
  );
};
