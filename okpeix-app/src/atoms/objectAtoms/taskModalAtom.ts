import { atom } from "recoil";
import { Task } from "../../components/Types/Task";
import { StoredProduct } from "@/src/components/Types/StoredProduct";

export interface TaskModalState {
  open: boolean;
  action?: "create" | "modify" | "delete" | "presets";
  context?: Task;
  // When opening, it sends current SPs
  // When closing, it sends back to OrderModal only the modified SPs
  newAllStored?: StoredProduct[];
}

const defaultModalState: TaskModalState = {
  open: false,
  action: undefined,
  context: undefined,
  newAllStored: undefined,
};

export const taskModalState = atom<TaskModalState>({
  key: "taskModalState",
  default: defaultModalState,
});
