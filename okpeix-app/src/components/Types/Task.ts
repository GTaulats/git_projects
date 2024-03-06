// Task is child of Order. Contains details of one task from that order.
// CreatedAt is stored in Task and Order to check if something has been modified later

import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Price, Product } from "./Product";
import { AppUser } from "./AppUser";
import { StoredProduct } from "./StoredProduct";

export type Amount = {
  value: number;
  units: string; // g, kg, piece, etc.
};

export type Task = {
  taskId: string;
  state: string;
  productId?: string; // Product associated to the task
  storedId?: string[]; // StoredProduct instance associated to this task. Could be >1 storedProduct x task (old + new/remaining + purchased)
  amount: Amount;
  realAmount: Amount; // actual weight delivered
  priceIn: Price; // price with which the item is purchased from market
  priceOut: Price; // price with which the item is sold out to
  readyElab: boolean;
  readyDeliv: boolean;
  elaborationId: string[]; // Elaborations to apply to the product
  details?: string; // elaboration details
  createdAt: Timestamp;
  creatorId: string;
};

export type TasksPreset = {
  name: string;
  tasks: Task[];
};
