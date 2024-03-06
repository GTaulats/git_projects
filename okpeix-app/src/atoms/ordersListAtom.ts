import { atom } from "recoil";
import { Order } from "../components/Types/Order";

// Task is child of Order, which contains info about client and delivery time, etc.
// CreatedAt is stored in Task and Order to check if something has been modified later

interface OrdersListState {
  orders: Order[];
}

const defaultOrdersListAtom: OrdersListState = {
  orders: [] as Order[],
}

export const ordersListAtom = atom<OrdersListState>({
  key: "orders",
  default: defaultOrdersListAtom
})