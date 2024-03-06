import { atom } from "recoil";
import { StoredProduct } from "@/src/components/Types/StoredProduct";

export interface StoredProductModalState {
  open: boolean;
  action: "create" | "modify" | "delete" | "presets" | undefined;
  context: StoredProduct | undefined;
}

const defaultModalState: StoredProductModalState = {
  open: false,
  action: undefined,
  context: undefined,
};

export const storedModalState = atom<StoredProductModalState>({
  key: "storedModalState",
  default: defaultModalState,
});
