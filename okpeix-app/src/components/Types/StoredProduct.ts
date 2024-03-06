import { Elaboration } from "./Elaboration";
import { Price, Product } from "./Product";
import { Amount } from "./Task";

export type StorageMethod = {
  stoMethodId: string;
  name: string;
  alias?: string;
  temperature?: Amount;
  vacuum?: boolean;
  details?: string;
};

export type StoragePhase = {
  pastPlace: string; // To track exact history of the product from acquisition, storage, devolution
  methodId: string; // StorageMethods
  date: Date; // Date phase creation
};

export type StoredProduct = {
  // Data to check and merge StoredProducts
  storedId: string; // Could allow tag tracking
  productId: string | undefined;
  providerId: string | undefined;
  gotBy?: String; // Has to be in ISO format "YYYY-MM-DD"
  priceIn?: Price; // To keep track of original price
  elaborations: Elaboration[];
  storageHistory: StoragePhase[]; // We might want to hide this from clients...

  // keeps track of what tasks are using the SP and reserves it
  // it is not until confirmation of Order (start elaboration) that is splitted

  assigned: { id: string; amount: Amount }[]; // [ [ taskId , Amount_used_in_task ], ...]

  // Data to split StoredProducts
  amount?: Amount; // Will change if bought more than needed for an order
  purchased?: boolean; // The product is yet to be bought.
  delivered?: boolean; // Undefined if still to be delivered, false if returned
  deliverBy?: String; // Has to be in ISO format "YYYY-MM-DD"
  details?: string;
  creatorId: string;
};
