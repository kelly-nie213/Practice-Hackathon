import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SCENE_DURATIONS, TRANSITION_FRAMES } from "./durations";
import { Scene1Title } from "./scenes/Scene1Title";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Pillars } from "./scenes/Scene4Pillars";
import { Scene5Memory } from "./scenes/Scene5Memory";
import { Scene6Safety } from "./scenes/Scene6Safety";
import { Scene7Rewards } from "./scenes/Scene7Rewards";
import { Scene8Team } from "./scenes/Scene8Team";

const fadeTiming = () => linearTiming({ durationInFrames: TRANSITION_FRAMES });

export const MyComposition: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.title}>
        <Scene1Title />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.problem}>
        <Scene2Problem />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.solution}>
        <Scene3Solution />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.pillars}>
        <Scene4Pillars />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.memory}>
        <Scene5Memory />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.safety}>
        <Scene6Safety />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.rewards}>
        <Scene7Rewards />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={fadeTiming()} />
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.team}>
        <Scene8Team />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
