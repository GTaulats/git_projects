import { atom } from "recoil";
import { Client } from "../../components/Types/AppUser";

export interface ClientModalState {
  open: boolean;
  action: "create" | "modify" | "delete" | undefined
  context: Client | undefined;
}

const defaultModalState: ClientModalState = {
  open: false,
  action: undefined,
  context: undefined
}

export const clientModalState = atom<ClientModalState>({
  key: "clientModalState",
  default: defaultModalState
})