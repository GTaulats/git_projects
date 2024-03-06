/*  Clients are made by default without authentification. All data is stored
    in a user-less data collection. The association and access to the app
    for a client will be performed once the client decides to log in, which
    will have to be done by an admin.
    The client will have to give the email, and the app will return a password
    in the client's invoice.
*/

// TODO:IS IT REALLY NECESSARY TO DO IT CONTROLLED? COULDN'T IT BE UNCONTROLLED??

import {
  Client,
  Direction,
  TelNumber,
  WorkHours,
} from "@/src/components/Types/AppUser";
import {
  Flex,
  Divider,
  Text,
  Stack,
  Select,
  Input,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Address from "./Address";
import PhoneNumber from "./PhoneNumber";
import { strDirection } from "@/src/components/Types/TypeFunctions";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { uniqueId } from "@/src/algorithms/uniqueId";
import { auth, firestore } from "@/src/firebase/clientApp";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { clientModalState } from "@/src/atoms/objectAtoms/clientModalAtom";
import ClientPresets from "./ClientPresets";
import { TasksPreset } from "@/src/components/Types/Task";
import { useAuthState } from "react-firebase-hooks/auth";
import { allClientsAtom } from "@/src/atoms/dataAtom";

type ClientInputsProps = {
  initialState: Client | undefined;
};

const ClientInputs: React.FC<ClientInputsProps> = ({ initialState }) => {
  const user = useAuthState(auth);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [directionModal, setDirectionModal] = useState(false);
  const setClientModal = useSetRecoilState(clientModalState);

  const allClients = useRecoilValue(allClientsAtom).allClients;
  const setAllClients = useSetRecoilState(allClientsAtom);

  const [newClient, setNewClient] = useState(
    initialState
      ? initialState
      : ({
          type: "clients",
          clientId: uniqueId(),
          presets: [] as TasksPreset[],
        } as Client)
  );

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewClient(
      (prev) =>
        ({
          ...prev,
          [event.target.name]: event.target.value,
        } as Client)
    );
  };

  const onPresetsChange = (presets: TasksPreset[]) => {
    setNewClient((prev) => ({
      ...prev,
      presets: presets,
    }));
  };

  const handleCreate = async () => {
    if (error) setError("");

    // Input errors
    if (!newClient?.name) {
      setError("Cal introduir un nom de client");
      return;
    }

    // Set final parameters if new, or update createdAt
    setNewClient(
      (prev) =>
        ({
          ...prev,
          createdAt: serverTimestamp(),
        } as Client)
    );

    setLoading(true);

    try {
      const clientDocRef = doc(firestore, "clients", newClient.clientId);
      await runTransaction(firestore, async (transaction) => {
        // const clientDoc = await transaction.get(clientDocRef);

        // Check if client already exists
        // TODO: PODRIA SORTIR ALGUN ERROR D'AQUESTA COMPROVACIÓ SI HI HA DIVERSOS USUARIS MODIFICANT...
        // if (clientDoc.exists()) {
        //   throw new Error(`Client ja existent.`);
        // }

        // Create client
        transaction.set(clientDocRef, newClient);

        setClientModal((prev) => ({
          ...prev,
          open: false,
          context: newClient,
          action: initialState ? "modify" : "create",
        }));
      });
      if (initialState) {
        console.log(`"${newClient.name}" client successfuly modified`);
      } else {
        console.log(`"${newClient.name}" client successfuly created`);
      }
    } catch (error: any) {
      console.log("handleCreate error", error);
      setError(error.message);
    }

    setAllClients((prev) => ({
      ...prev,
      allClients: [
        ...prev.allClients.filter(
          (item) => item.clientId !== newClient.clientId
        ),
        newClient,
      ] as Client[],
    }));

    setLoading(false);

    // Cleanup
    setNewClient({} as Client);
    setClientModal((prev) => ({
      ...prev,
      context: undefined,
      action: undefined,
    }));
  };

  const handleClose = () => {
    setClientModal((prev) => ({
      ...prev,
      open: false,
      action: undefined,
    }));
  };

  const onWorkHoursChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewClient(
      (prev) =>
        ({
          ...prev,
          workHours: {
            ...prev!.workHours,
            [event.target.name]: event.target.value,
          } as WorkHours,
        } as Client)
    );
  };

  const onTelChange = (telNumber: TelNumber) => {
    setNewClient(
      (prev) =>
        ({
          ...prev,
          tel: telNumber,
        } as Client)
    );
  };

  return (
    <>
      <Stack pr={2}>
        <Text fontSize="11pt" color="red.400" pt={1}>
          {error}
        </Text>
        <Flex>
          <Flex align="center">
            <Text ml="auto" mr={3} textAlign="right">
              Nom:
            </Text>
            <Input
              name="name"
              autoFocus
              required
              type="text"
              width="75%"
              placeholder="Ex: Set Portes"
              onChange={onChange}
              value={newClient?.name}
            />
          </Flex>
          <Flex ml="auto" align="right">
            <Select name="type" onChange={onChange} value={newClient?.type}>
              <option value="restaurant">Restaurant</option>
              <option value="particular">Particular</option>
              <option value="shop">Parada</option>
            </Select>
          </Flex>
        </Flex>
        <Divider />
        <Flex align="center">
          <Text ml="auto" mr={3} textAlign="right">
            Alias:
          </Text>
          <Input
            name="alias"
            type="text"
            width="75%"
            placeholder="Ex: 7p"
            onChange={onChange}
            value={newClient?.alias}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3} textAlign="right">
            Nom fiscal:
          </Text>
          <Input
            name="legalName"
            type="text"
            width="75%"
            onChange={onChange}
            value={newClient?.legalName}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3} textAlign="right">
            Email:
          </Text>
          <Input
            name="email"
            type="text"
            width="75%"
            onChange={onChange}
            value={newClient?.email}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3} textAlign="right">
            Ubicació:
          </Text>
          <Address
            isOpen={directionModal}
            onClose={(direction: Direction) => {
              setDirectionModal(false);
              if (direction.street) {
                setNewClient(
                  (prev) =>
                    ({
                      ...prev,
                      direction: direction,
                    } as Client)
                );
              }
            }}
            // onChange={onAddressChange}
          />
          <Flex
            width="75%"
            border="1px solid"
            borderColor="gray.200"
            borderRadius={6}
            p="7px 10px 7px 15px"
            _hover={{ borderColor: "gray.300" }}
            onClick={() => {
              setDirectionModal(true);
            }}
          >
            <Flex textTransform="capitalize">
              {strDirection(newClient?.direction)}
            </Flex>
          </Flex>
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3} textAlign="right">
            Num. Telèfon:
          </Text>
          <PhoneNumber
            preset={
              initialState?.tel || {
                code: "34",
                number: "",
              }
            }
            onChange={onTelChange}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3} textAlign="right">
            NIF:
          </Text>
          <Input
            name="nif"
            type="text"
            width="75%"
            onChange={onChange}
            value={newClient?.nif}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3} textAlign="right">
            Horaris:
          </Text>
          <Flex width="75%" align="center">
            <Input
              name="start"
              type="time"
              width="75%"
              onChange={onWorkHoursChange}
              value={newClient?.workHours?.start}
            />
            <Text m="0 10px">a</Text>
            <Input
              name="end"
              type="time"
              width="75%"
              onChange={onWorkHoursChange}
              value={newClient?.workHours?.end}
            />
          </Flex>
        </Flex>
        <ClientPresets
          contextClient={newClient.presets}
          onChange={onPresetsChange}
        />

        <Divider />

        <Flex mt={2} justify="right" align="center">
          <Flex>
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel·la
            </Button>
            <Button
              height="30px"
              onClick={handleCreate} // handleCreate
              isLoading={loading}
            >
              {initialState ? "Modifica client" : "Crear client"}
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </>
  );
};
export default ClientInputs;
