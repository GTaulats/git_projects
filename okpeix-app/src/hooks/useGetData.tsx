/*  
    I decided that there's no problem in downloading all primary data like
    products, clients, providers and elaborations (it's all a limited list of
    objects anyways). It will be updated when refreshing, asked for, or when
    modifying entries.
    Orders will be fetched from the db based on date.
*/

import { query, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
  allClientsAtom,
  allProductsAtom,
  allProvidersAtom,
} from "../atoms/dataAtom";
import { storedProductsListAtom } from "../atoms/storedListAtom";

// export async function getDataObject(directory: string, id: string) {
//   // setDataLoading(true);
//   try {
//     const docRef = doc(firestore, directory, id);
//     const dataDoc = await getDoc(docRef);
//     return {
//       communityData: dataDoc.exists()
//         ? JSON.parse(
//             JSON.stringify({
//               id: dataDoc.id,
//               ...dataDoc.data(),
//             })
//           )
//         : "",
//     };
//   } catch (error) {
//     console.log("getProducts error: ", error);
//   }
//   // setDataLoading(false);
// }

export async function getDataArray(directory: string) {
  // setDataLoading(true);
  try {
    const queryRef = query(collection(firestore, directory));
    const dataDocs = await getDocs(queryRef);
    const dataArray = dataDocs.docs.map((doc) => ({
      ...doc.data(),
    }));
    return dataArray;
  } catch (error) {
    console.log("getProducts error: ", error);
  }
  // setDataLoading(false);
}

/*
  Example of usage with Client (Not optimal at all, but it works):
  
  const [allClients, setAllClients] = useRecoilState(allClientsAtom);
  const [clients, setClients] = useState<Client[]>();

  → Execute code at initial render and store firebase values to clients
  useEffect(() => {
    const updateClients = async () => {
      setClients((await getDataArray("clients").then()) as Client[]);
    };
    updateClients();
  }, []);

  → Write clients to allClients
  useEffect(() => {
    clients && setAllClients((prev) => ({ ...prev, allClients: clients }));
  }, [clients]);
*/

export function findById(array: any, key: string, id: string): any {
  return array.find((item: any) => {
    return item[key] === id;
  });
}

/*
    order?.clientId
      ? (findById(allClients, "clientId", order.clientId) as unknown as Client)
      : undefined
*/

// General reciever:
function generalReciever(paramAtom: any, paramDB: string, paramKey: string) {
  const setAllItems = useSetRecoilState(paramAtom);
  const [items, setItems] = useState();
  useEffect(() => {
    const updatedItems = async () => {
      setItems(await getDataArray(paramDB).then());
    };
    updatedItems();
  }, []);
  useEffect(() => {
    items && setAllItems((prev: any) => ({ ...prev, [paramKey]: items }));
  }, [items]);
}

export function dataReciever(...keys: string[]) {
  console.log("dataReciever", keys);
  // Updates all recoli state values from DB
  // TODO: ORDERS
  if (keys.length == 0) {
    generalReciever(allClientsAtom, "clients", "allClients");
    generalReciever(allProvidersAtom, "providers", "allProviders");
    generalReciever(allProductsAtom, "products", "allProducts");
    generalReciever(storedProductsListAtom, "storage", "storedProducts");
    return;
  } else {
    keys.forEach((key) => {
      key === "clients" &&
        generalReciever(allClientsAtom, "clients", "allClients");
      key === "providers" &&
        generalReciever(allProvidersAtom, "providers", "allProviders");
      key === "products" &&
        generalReciever(allProductsAtom, "products", "allProducts");
      key === "storage" &&
        generalReciever(storedProductsListAtom, "storage", "storedProducts");
    });
    return;
  }
}
