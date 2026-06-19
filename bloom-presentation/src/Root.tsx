import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { SCENE_DURATIONS, TRANSITION_FRAMES } from "./durations";

const TOTAL_DURATION =
  Object.values(SCENE_DURATIONS).reduce((sum, d) => sum + d, 0) -
  (Object.keys(SCENE_DURATIONS).length - 1) * TRANSITION_FRAMES;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BloomPresentation"
        component={MyComposition}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
