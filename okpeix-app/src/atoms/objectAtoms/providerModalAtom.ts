import { atom } from "recoil";
import { Provider } from "../../components/Types/AppUser";

export interface ProviderModalState {
  open: boolean;
  action: "create" | "modify" | "delete" | undefined
  context: Provider | undefined;
}

const defaultModalState: ProviderModalState = {
  open: false,
  action: undefined,
  context: undefined
}

export const providerModalState = atom<ProviderModalState>({
  key: "providerModalState",
  default: defaultModalState
})