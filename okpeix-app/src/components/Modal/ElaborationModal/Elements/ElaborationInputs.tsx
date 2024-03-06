// TODO:IS IT REALLY NECESSARY TO DO IT CONTROLLED? COULDN'T IT BE UNCONTROLLED??

import {
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
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { strDirection } from "@/src/components/Types/TypeFunctions";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { uniqueId } from "@/src/algorithms/uniqueId";
import { firestore } from "@/src/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { elaborationModalState } from "@/src/atoms/objectAtoms/elaborationModalAtom";
import ElaborationPresets from "./ElaborationPresets";
import { Elaboration } from "@/src/components/Types/Elaboration";

type ElaborationInputsProps = {
  initialState: Elaboration | undefined;
};

const ElaborationInputs: React.FC<ElaborationInputsProps> = ({
  initialState,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [directionModal, setDirectionModal] = useState(false);
  const setElaborationModal = useSetRecoilState(elaborationModalState);

  const [newElaboration, setNewElaboration] = useState(
    initialState ? initialState : ({ elaborationId: uniqueId() } as Elaboration)
  );

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setNewElaboration(
      (prev) =>
        ({
          ...prev,
          [event.target.name]: event.target.value,
        } as Elaboration)
    );
  };

  const handleCreate = async () => {
    if (error) setError("");

    // Input errors
    if (!newElaboration?.name) {
      setError("Cal introduir un nom de elaboration");
      return;
    }

    // Set final parameters if new, or update createdAt
    setNewElaboration(
      (prev) =>
        ({
          ...prev,
          createdAt: serverTimestamp(),
        } as Elaboration)
    );

    setLoading(true);

    try {
      const elaborationDocRef = doc(
        firestore,
        "elaborations",
        newElaboration.elaborationId
      );
      await runTransaction(firestore, async (transaction) => {
        // const elaborationDoc = await transaction.get(elaborationDocRef);

        // Check if elaboration already exists
        // TODO: PODRIA SORTIR ALGUN ERROR D'AQUESTA COMPROVACIÓ SI HI HA DIVERSOS USUARIS MODIFICANT...
        // ERROR: TEL QUEDA UN ESTAT ENDARRERIT AL GUARDAR
        // if (elaborationDoc.exists()) {
        //   throw new Error(`Elaboration ja existent.`);
        // }

        // Create elaboration
        transaction.set(elaborationDocRef, newElaboration);

        setElaborationModal((prev) => ({
          ...prev,
          open: false,
          context: newElaboration,
          action: initialState ? "modify" : "create",
        }));
      });
      if (initialState) {
        console.log(
          `"${newElaboration.name}" elaboration successfuly modified`
        );
      } else {
        console.log(`"${newElaboration.name}" elaboration successfuly created`);
      }
    } catch (error: any) {
      console.log("handleCreate error", error);
      setError(error.message);
    }

    setLoading(false);

    // Cleanup
    setNewElaboration({} as Elaboration);
    setElaborationModal((prev) => ({
      ...prev,
      context: undefined,
      action: undefined,
    }));
  };

  const handleClose = () => {
    setElaborationModal((prev) => ({
      ...prev,
      open: false,
      action: undefined,
    }));
  };

  //TODO: IMAGE

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
              placeholder="Ex: Filet"
              onChange={onChange}
              value={newElaboration?.name}
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
            placeholder="Ex: Tallat transversal"
            onChange={onChange}
            value={newElaboration?.alias}
          />
        </Flex>
        <Divider />
        <Flex justify="center" align="center" flex={1}>
          <Flex justify="left" direction="column" flex={1}>
            <Text>Descripció:</Text>
            <Textarea
              name="details"
              placeholder="Ex: Es passa el ganivet arran d'espina transversalment. Se'n fa trossos si es demana"
              onChange={onChange}
              value={newElaboration?.details}
            />
          </Flex>
        </Flex>

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
              {initialState ? "Modifica elaboració" : "Crea elaboració"}
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </>
  );
};
export default ElaborationInputs;
