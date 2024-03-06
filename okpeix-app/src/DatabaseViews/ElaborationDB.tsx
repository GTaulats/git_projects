import React, { useEffect, useState } from "react";
import ElaborationModal from "../components/Modal/ElaborationModal/ElaborationModal";
import { Flex, Button, Spinner } from "@chakra-ui/react";
import ClientElement from "../components/Database/ClientElement";
import { elaborationModalState } from "../atoms/objectAtoms/elaborationModalAtom";
import { useRecoilState } from "recoil";
// import ElaborationElement from "../components/Database/ElaborationElement";
import { query, collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { Elaboration } from "../components/Types/Elaboration";
import ElaborationElement from "../components/Database/ElaborationElement";

type ElaborationDBProps = {};

const ElaborationDB: React.FC<ElaborationDBProps> = () => {
  const [loading, setLoading] = useState(false);

  const [elaborationState, setElaborationState] = useRecoilState(
    elaborationModalState
  );

  const [elaborations, setElaborations] = useState([] as Elaboration[]); //Retrieved data from DB

  useEffect(() => {
    // When closing modal, updates local setClients
    if (!elaborationState.open && elaborationState.context !== undefined) {
      const modifyIndex = elaborations?.findIndex((item) => {
        return item.elaborationId === elaborationState?.context?.elaborationId;
      });
      switch (elaborationState.action) {
        case "create":
          setElaborations(
            (prev) => [...prev, elaborationState.context] as Elaboration[]
          );
          return;
        case "modify":
          if (modifyIndex! > -1) {
            setElaborations(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  elaborationState.context,
                  ...prev.slice(modifyIndex + 1),
                ] as Elaboration[]
            );
          }
          return;
        case "delete":
          if (modifyIndex! > -1) {
            setElaborations(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  ...prev.slice(modifyIndex + 1),
                ] as Elaboration[]
            );
          }
          return;
      }
      setElaborationState((prev) => ({
        ...prev,
        context: undefined,
        action: undefined,
      }));
    }
  }, [elaborationState.open]);

  const getElaborations = async () => {
    setLoading(true);
    try {
      const queryRef = query(collection(firestore, "elaborations"));
      const elaborationDocs = await getDocs(queryRef);
      const elaborations = elaborationDocs.docs.map((doc) => ({
        elaborationId: doc.id,
        ...doc.data(),
      }));
      setElaborations(elaborations as Elaboration[]);
    } catch (error) {
      console.log("getElaborations error: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getElaborations();
  }, []);

  const onClick = (item: Elaboration) => {
    setElaborationState((prev) => ({
      ...prev,
      open: true,
      context: item,
      action: "modify",
    }));
  };

  return (
    <>
      <ElaborationModal />
      <Button
        position="fixed"
        bottom={10}
        right={10}
        p={7}
        fontSize="14pt"
        onClick={() =>
          setElaborationState((prev) => ({
            ...prev,
            open: true,
            context: undefined,
            action: "create",
          }))
        }
      >
        + Crea nova elaboració
      </Button>
      <Flex direction="column" align="center" width="100%" height="100%">
        <Flex p={2} width="100%">
          <Flex flexWrap="wrap" width="100%">
            {loading ? (
              <Spinner />
            ) : (
              <>
                {/* All elaboration info is stored inside */}
                {elaborations.map((item) => {
                  return (
                    <ElaborationElement
                      key={item.elaborationId}
                      elaboration={item}
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
export default ElaborationDB;
