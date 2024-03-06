// Any entity which may use the app

import { Timestamp } from "firebase/firestore";
import { ProductTransaction } from "./Product";
import { TasksPreset } from "./Task";
import { User } from "firebase/auth";


export type Direction = {
  streetType?: string;
  street?: string;
  number?: string;
  postalCode?: string;
  city?: string;
  province?: string;
  country?: string;
}

export type TelNumber = {
  code: string;
  number: string;
}

export type WorkHours = {
  start: string;
  end: string;
}


export type AppUser = {
  firebaseUserId: string; // Connected to firebase "User". TODO: Should generate one every time a client/employee is made
  creatorId: string;
  createdAt: Timestamp;

  name: string;           // Known name
  alias?: string[];        // Other names
  legalName?: string;     // Legal name
  tel?: TelNumber;        // Telephone number
  email?: string;         
  workHours?: WorkHours;  // Hours when the place opens
  imageURL?: string;      // Image for client
}

export type Employee = AppUser & {
  employeeId: string;
  role: string;                 // worker, admin
  socialSecurityNumber: string; // not using SS lol
  miscellaneous?: any[];         // Other data (isDriver, others)
}

export type Client = AppUser & {
  clientId: string
  type: string;           // Restaurant, person, shopClient
  productTransactions?: ProductTransaction[]; // Record of products sold and price
  refName?: string[];     // Person/s to address to
  nif?: string;           // NIF code
  direction?: Direction;  // Place where to deliver (for all shopClient, all the same)
  presets: TasksPreset[]; // To easen order creation

  // Could add another to define how well has to be done/importance/VIP → Indirectly seen from sells

  miscellaneous?: any[];         // Other data (isDriver, others)
}

export type Provider = AppUser & {
  providerId: string;
  productTransactions?: ProductTransaction[]; // Record of products bought and price
  refName?: string[];     // Person/s to address to
  nif?: string;           // NIF code
  direction: Direction;  // Place where to deliver (for shopClients)
  presets: TasksPreset[]; // To easen order creation
  miscellaneous?: any[];         // Other data (isDriver, others)
}