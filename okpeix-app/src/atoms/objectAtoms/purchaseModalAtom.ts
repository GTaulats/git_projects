import { StoredProduct } from "@/src/components/Types/StoredProduct";
import { atom } from "recoil";

export interface PurchaseModalState {
  open: boolean;
  action: "create" | "modify" | "delete" | undefined;
  context: StoredProduct | undefined;
}

// Essentialy, TasksPreset is an Purchase with name

const defaultModalState: PurchaseModalState = {
  open: false,
  action: undefined,
  context: undefined,
};

export const purchaseModalState = atom<PurchaseModalState>({
  key: "purchaseModalState",
  default: defaultModalState,
});
