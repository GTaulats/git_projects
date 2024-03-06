import { atom } from "recoil";
import { Product } from "@/src/components/Types/Product";

export interface ProductModalState {
  open: boolean;
  action: "create" | "modify" | "delete" | undefined
  context: Product | undefined;
}

const defaultModalState: ProductModalState = {
  open: false,
  action: undefined,
  context: undefined
}

export const productModalState = atom<ProductModalState>({
  key: "productModalState",
  default: defaultModalState
})