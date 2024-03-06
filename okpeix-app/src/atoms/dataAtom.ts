/*  
    I decided that there's no problem in downloading all primary data like
    products, clients, providers and elaborations (it's all a limited list of
    objects anyways). It will be updated when refreshing, asked for, or when
    modifying entries.
    Orders will be fetched from the db based on date.
*/

import { atom } from "recoil";
import { Client, Provider } from "../components/Types/AppUser";
import { getDataArray } from "../hooks/useGetData";
import { Product } from "../components/Types/Product";
import { Elaboration } from "../components/Types/Elaboration";

interface allClientsState {
  allClients: Client[];
}
const defaultAllClientsAtom: allClientsState = {
  allClients: [] as Client[],
};
export const allClientsAtom = atom<allClientsState>({
  key: "allClients",
  default: defaultAllClientsAtom,
});

interface allProductsState {
  allProducts: Product[];
}
const defaultAllProductsAtom: allProductsState = {
  allProducts: [] as Product[],
};
export const allProductsAtom = atom<allProductsState>({
  key: "allProducts",
  default: defaultAllProductsAtom,
});

interface allProvidersState {
  allProviders: Provider[];
}
const defaultAllProvidersAtom: allProvidersState = {
  allProviders: [] as Provider[],
};
export const allProvidersAtom = atom<allProvidersState>({
  key: "allProviders",
  default: defaultAllProvidersAtom,
});

interface allElaborationsState {
  allElaborations: Elaboration[];
}
const defaultAllElaborationsAtom: allElaborationsState = {
  allElaborations: [] as Elaboration[],
};
export const allElaborationsAtom = atom<allElaborationsState>({
  key: "allElaborations",
  default: defaultAllElaborationsAtom,
});

// Functions to update data

export async function updatedAllClients() {
  const updatedClients = (await getDataArray("clients").then()) as Client[];
  return updatedClients;
}

export async function updatedAllProducts() {
  const updatedProducts = (await getDataArray("products").then()) as Product[];
  return updatedProducts;
}

export async function updatedAllProviders() {
  const updatedProviders = (await getDataArray(
    "providers"
  ).then()) as Provider[];
  return updatedProviders;
}

export async function updatedAllElaborations() {
  const updatedElaborations = (await getDataArray(
    "elaborations"
  ).then()) as Elaboration[];
  return updatedElaborations;
}
