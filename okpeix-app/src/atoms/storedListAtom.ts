import { atom } from "recoil";
import { StoredProduct } from "../components/Types/StoredProduct";

// Task is child of Purchase, which contains info about client and delivery time, etc.
// CreatedAt is stored in Task and Purchase to check if something has been modified later

interface StoredProductsListState {
  storedProducts: StoredProduct[];
}

const defaultStoredProductsListAtom: StoredProductsListState = {
  storedProducts: [] as StoredProduct[],
};

export const storedProductsListAtom = atom<StoredProductsListState>({
  key: "storedProducts",
  default: defaultStoredProductsListAtom,
});
