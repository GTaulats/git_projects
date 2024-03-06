import { atom } from "recoil";
import { Order } from "../../components/Types/Order";

export interface OrderModalState {
  open: boolean;
  action: "create" | "modify" | "delete" | undefined;
  context: Order | undefined;
}

// Essentialy, TasksPreset is an Order with name

const defaultModalState: OrderModalState = {
  open: false,
  action: undefined,
  context: undefined
}

export const orderModalState = atom<OrderModalState>({
  key: "orderModalState",
  default: defaultModalState
})