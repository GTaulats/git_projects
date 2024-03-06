/*
    Whithin an order, there is no task merging since it's dangerous to modify
    tasks automatically.
    TODO: When creating a task , it will be checked if the same products are being
    used in the same order, and warn the user that there's already a task with
    that product, but can proceed. At the aftermath it will be merged.

    TODO: When merging orders, there might be tasks conflicts, so it will be told to
    workers to deal with it. (Should never happen really, but still). The order
    won't be able to proceed until the conflicts are solved.
*/

import { uniqueId } from "../algorithms/uniqueId";
import { Client } from "../components/Types/AppUser";
import { Order } from "../components/Types/Order";
import { StoredProduct } from "../components/Types/StoredProduct";
import { Amount } from "../components/Types/Task";

/*
    Merges orders by client if they're the same day, combining all tasks in one
    single order. Will be used after a prompt.
    Takes client and date of first element in the array and filters the whole
    array against it. If matches found, merge all the info into the first one
    and delete all others. Then, go to the next item and repeat until reached
    the end.
    Useful when client makes an order but there were already one for that day.
    Details will be also merge, specifying who wrote it.
 */
// const mergeOrders = (orders: Order[]) => {
//   orders.reduce((finalOrders, item, index) => {
//     return finalOrders;
//   });
//   let client: Client;
//   let date: Date;

//   for (let i = 0; i < orders.length; i++) {}
// };

// const orderCompare = (i: Order, j: Order): Boolean => {
//   return i.client === j.client && i.deliverBy === j.deliverBy;
// };

// const orderFuse = (i: Order, j: Order): Order => {
//   const fusedTasks = [...i.tasks, ...j.tasks];
//   const fusedDetails = `${i.creator.name}: ${i.details}`;
//   return { ...i, tasks: fusedTasks } as Order;
// };

// const tasksCheck = () => {};

//////////////////////////////////////////////////////////////
// StoredProduct Utils

// Recieves a storedId and the amount wanted for the splitted part.
// Returns the remaining original one and the new splitted in an array.
// Different units are not supported, they should come converted beforehand
export function splitStored(stored: StoredProduct, splitAmount: Amount) {
  return [
    {
      ...stored,
      amount: {
        ...stored.amount,
        value: stored.amount!.value - splitAmount.value,
      },
    } as StoredProduct,
    {
      ...stored, // Based on full StoredProduct
      storedId: uniqueId(), // New Id
      clientId: "storage",
      // creatorId: TODO with recoil
      amount: splitAmount,
    } as StoredProduct,
  ] as [StoredProduct, StoredProduct];
}
