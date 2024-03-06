// TODO:IS IT REALLY NECESSARY TO DO IT CONTROLLED? COULDN'T IT BE UNCONTROLLED??

import {
  Provider,
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
import { firestore } from "@/src/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { providerModalState } from "@/src/atoms/objectAtoms/providerModalAtom";
import ProviderPresets from "./ProviderPresets";
import { TasksPreset } from "@/src/components/Types/Task";

type ProviderInputsProps = {
  initialState: Provider | undefined;
};

const ProviderInputs: React.FC<ProviderInputsProps> = ({ initialState }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [directionModal, setDirectionModal] = useState(false);
  const setProviderModal = useSetRecoilState(providerModalState);

  const [newProvider, setNewProvider] = useState(
    initialState
      ? initialState
      : ({ providerId: uniqueId(), presets: [] as TasksPreset[] } as Provider)
  );

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewProvider(
      (prev) =>
        ({
          ...prev,
          [event.target.name]: event.target.value,
        } as Provider)
    );
  };

  const onPresetsChange = (presets: TasksPreset[]) => {
    setNewProvider((prev) => ({
      ...prev,
      presets: presets,
    }));
  };

  const handleCreate = async () => {
    if (error) setError("");

    // Input errors
    if (!newProvider?.name) {
      setError("Cal introduir un nom de provider");
      return;
    }

    // Set final parameters if new, or update createdAt
    setNewProvider(
      (prev) =>
        ({
          ...prev,
          createdAt: serverTimestamp(),
        } as Provider)
    );

    setLoading(true);

    try {
      const providerDocRef = doc(
        firestore,
        "providers",
        newProvider.providerId
      );
      await runTransaction(firestore, async (transaction) => {
        // const providerDoc = await transaction.get(providerDocRef);

        // Check if provider already exists
        // TODO: PODRIA SORTIR ALGUN ERROR D'AQUESTA COMPROVACIÓ SI HI HA DIVERSOS USUARIS MODIFICANT...
        // ERROR: TEL QUEDA UN ESTAT ENDARRERIT AL GUARDAR
        // if (providerDoc.exists()) {
        //   throw new Error(`Provider ja existent.`);
        // }

        // Create provider
        transaction.set(providerDocRef, newProvider);

        setProviderModal((prev) => ({
          ...prev,
          open: false,
          context: newProvider,
          action: initialState ? "modify" : "create",
        }));
      });
      if (initialState) {
        console.log(`"${newProvider.name}" provider successfuly modified`);
      } else {
        console.log(`"${newProvider.name}" provider successfuly created`);
      }
    } catch (error: any) {
      console.log("handleCreate error", error);
      setError(error.message);
    }

    setLoading(false);

    // Cleanup
    setNewProvider({} as Provider);
    setProviderModal((prev) => ({
      ...prev,
      context: undefined,
      action: undefined,
    }));
  };

  const handleClose = () => {
    setProviderModal((prev) => ({
      ...prev,
      open: false,
      action: undefined,
    }));
  };

  const onWorkHoursChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewProvider(
      (prev) =>
        ({
          ...prev,
          workHours: {
            ...prev!.workHours,
            [event.target.name]: event.target.value,
          } as WorkHours,
        } as Provider)
    );
  };

  const onTelChange = (telNumber: TelNumber) => {
    setNewProvider(
      (prev) =>
        ({
          ...prev,
          tel: telNumber,
        } as Provider)
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
              placeholder="Ex: Consignaciones del mar"
              onChange={onChange}
              value={newProvider?.name}
            />
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
            placeholder="Ex: CM"
            onChange={onChange}
            value={newProvider?.alias}
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
            value={newProvider?.legalName}
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
            value={newProvider?.email}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3} textAlign="right">
            Ubicació:
          </Text>
          {directionModal && (
            <Address
              isOpen={directionModal}
              onClose={(direction: Direction) => {
                setDirectionModal(false);
                if (direction.street) {
                  setNewProvider(
                    (prev) =>
                      ({
                        ...prev,
                        direction: direction,
                      } as Provider)
                  );
                }
              }}
              // onChange={onAddressChange}
            />
          )}
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
              {strDirection(newProvider?.direction)}
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
            value={newProvider?.nif}
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
              value={newProvider?.workHours?.start}
            />
            <Text m="0 10px">a</Text>
            <Input
              name="end"
              type="time"
              width="75%"
              onChange={onWorkHoursChange}
              value={newProvider?.workHours?.end}
            />
          </Flex>
        </Flex>
        <ProviderPresets
          contextProvider={newProvider.presets}
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
              {initialState ? "Modifica proveïdor" : "Crear proveïdor"}
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </>
  );
};
export default ProviderInputs;
