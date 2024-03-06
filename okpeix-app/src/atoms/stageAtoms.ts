import { atom } from "recoil";

interface Stage {
  stage:
    | "invoice"
    | "toPurchase"
    | "elaboration"
    | "delivery"
    | "reminders"
    | "calculator";
}

const defaultStageState: Stage = {
  stage: "invoice",
};

export const stageState = atom<Stage>({
  key: "stageState",
  default: defaultStageState,
});
