import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface FadeUpProps {
  children: React.ReactNode;
  delayFrames?: number;
  durationFrames?: number;
  distance?: number;
  style?: React.CSSProperties;
}

// Replaces the CSS `fadeUp` keyframe + animation-delay pattern used
// throughout the original deck (`.slide.anim ... { animation: fadeUp ... }`).
export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  delayFrames = 0,
  durationFrames = 18,
  distance = 22,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delayFrames;

  const progress = interpolate(local, [0, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * distance}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface ExpandLineProps {
  delayFrames?: number;
  durationFrames?: number;
  width?: number;
  color: string;
  centered?: boolean;
  style?: React.CSSProperties;
}

// Replaces the CSS `expandLine` keyframe used for the gold `.divider`.
export const ExpandLine: React.FC<ExpandLineProps> = ({
  delayFrames = 0,
  durationFrames = 16,
  width = 56,
  color,
  centered = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delayFrames;

  const progress = interpolate(local, [0, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        width,
        height: 1,
        background: color,
        opacity: progress * 0.55,
        transform: `scaleX(${progress})`,
        transformOrigin: centered ? "center" : "left",
        margin: centered ? "22px auto" : "22px 0",
        ...style,
      }}
    />
  );
};
