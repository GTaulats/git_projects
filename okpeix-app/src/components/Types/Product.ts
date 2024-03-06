// Description of the products bought and sold. Doesn't include prices.

/*  Should think about using only the product's ID when assigning products to 
    tasks and clients and not the whole object.
    It would be far more memory efficient, although it would require to access
    the database for all references.
    Same thing with Client assignation to Orders and storedProducts.
*/

import { Amount } from "./Task";

export type Price = {
  value: number;
  coin: string;
  units: string;
}

export type MeanPrice = { // Crucial for statistics
  price: Price;
  mean: number;
}

export type StorageInfo = { // Basic info on how to preserve things
  method: string;     // Fridge, freezer, void
  expiration: number; // Days
}

export type Product = {
  productId: string;
  name: string;
  alias: string; // Other known names, other languages, scientific name, ...
  codeName: string;
  type: string; // Fish, seafood, etc.
  size: Amount[]; // Different sizes
  details: string;

  storageInfo: StorageInfo[]; // Specifies expiration depending on how it's preserved
}

export type ProductTransaction = {
  partnerId: string;
  productId: string;
  totalAmount: Amount;
  lastPrices: Price[];
  meanPrice: MeanPrice;
}