import { atom } from "recoil";
import { Elaboration } from "@/src/components/Types/Elaboration";

export interface ElaborationModalState {
  open: boolean;
  action: "create" | "modify" | "delete" | undefined;
  context: Elaboration | undefined;
}

const defaultModalState: ElaborationModalState = {
  open: false,
  action: undefined,
  context: undefined,
};

export const elaborationModalState = atom<ElaborationModalState>({
  key: "elaborationModalState",
  default: defaultModalState,
});
