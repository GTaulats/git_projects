import { Timestamp } from "firebase/firestore";
import { Task } from "./Task";

type orderStage = "purchasing" | "elaborating" | "delivering" | "payment" | "paid";

export type Order = {
  orderId: string;
  clientId?: string;
  creatorId: string;
  deliverBy: Date;
  stage: orderStage;
  tasks: Task[];
  details: string;
  createdAt: Timestamp;
};