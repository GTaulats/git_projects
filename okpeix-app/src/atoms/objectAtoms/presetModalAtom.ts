import { atom } from "recoil";
import { TasksPreset } from "../../components/Types/Task";

export interface PresetModalState {
  open: boolean;
  action: "create" | "modify" | "delete" | undefined;
  context: TasksPreset| undefined;
}

// Essentialy, TasksPreset is an Order with name

const defaultModalState: PresetModalState = {
  open: false,
  action: undefined,
  context: undefined
}

export const presetModalState = atom<PresetModalState>({
  key: "presetModalState",
  default: defaultModalState
})