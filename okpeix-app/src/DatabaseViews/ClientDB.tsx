import { clientModalState } from "@/src/atoms/objectAtoms/clientModalAtom";
import ClientElement from "@/src/components/Database/ClientElement";
import ClientModal from "@/src/components/Modal/ClientModal/ClientModal";
import { Client } from "@/src/components/Types/AppUser";
import { firestore } from "@/src/firebase/clientApp";
import { Flex, Button, Spinner, Text, Select } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

type ClientDBProps = {};

const ClientDB: React.FC<ClientDBProps> = () => {
  const [loading, setLoading] = useState(false);

  const [clientState, setClientState] = useRecoilState(clientModalState);

  const [clients, setClients] = useState<Client[]>([]);

  const [sort, setSort] = useState<string>("az");

  useEffect(() => {
    // When closing modal, updates local setClients
    if (!clientState.open && clientState.context !== undefined) {
      const modifyIndex = clients?.findIndex((item) => {
        return item.clientId === clientState?.context?.clientId;
      });
      switch (clientState.action) {
        case "create":
          setClients((prev) => [...prev, clientState.context] as Client[]);
          return;
        case "modify":
          if (modifyIndex! > -1) {
            setClients(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  clientState.context,
                  ...prev.slice(modifyIndex + 1),
                ] as Client[]
            );
          }
          return;
        case "delete":
          if (modifyIndex! > -1) {
            setClients(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  ...prev.slice(modifyIndex + 1),
                ] as Client[]
            );
          }
          return;
      }
      setClientState((prev) => ({
        ...prev,
        context: undefined,
        action: undefined,
      }));
    }
  }, [clientState.open]);

  useEffect(() => {
    console.log("yoo");
    const newClients = [...clients].sort((a, b) => {
      console.log("iterationn");
      console.log(a.name);
      console.log(b.name);
      console.log(a.name > b.name);
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });
    console.log("clients", clients);
    console.log("newClients", newClients);
    if (sort === "az")
      setClients(
        [...clients].sort((a, b) => {
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        })
      );
    // console.log(clients);
    // console.log(
    //   clients.sort((a, b) => {
    //     return a.name < b.name ? -1 : 1;
    //   })
    // );
  }, [sort]);

  const getClients = async () => {
    setLoading(true);
    try {
      const queryRef = query(
        collection(firestore, "clients"),
        orderBy("name", "asc")
      );
      const clientDocs = await getDocs(queryRef);
      const clients = clientDocs.docs.map((doc) => ({
        clientId: doc.id,
        ...doc.data(),
      }));
      setClients(clients as Client[]);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    getClients();
  }, []);

  const onClick = (item: Client) => {
    setClientState((prev) => ({
      ...prev,
      open: true,
      context: item,
      action: "modify",
    }));
  };
  return (
    <>
      <ClientModal />
      <Flex direction="row">
        <Text>Ordre: </Text>
        <Select onChange={(event) => setSort}>
          <option value="az">az</option>
        </Select>
      </Flex>
      <Flex direction="column" align="center" width="100%" height="100%">
        <Button
          onClick={() =>
            setClientState((prev) => ({
              ...prev,
              open: true,
              context: undefined,
            }))
          }
        >
          Crea nou client
        </Button>
        <Flex p={2} width="100%" height="100%">
          <Flex
            flexWrap="wrap"
            width="100%"
            height="100%"
            border="1px solid black"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                {clients.map((item) => {
                  return (
                    <ClientElement
                      key={item.clientId}
                      client={item}
                      onClick={() => onClick(item)}
                    />
                  );
                })}
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default ClientDB;
