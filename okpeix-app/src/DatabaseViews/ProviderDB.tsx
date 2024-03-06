import { providerModalState } from "@/src/atoms/objectAtoms/providerModalAtom";
import ProviderElement from "@/src/components/Database/ProviderElement";
import ProviderModal from "@/src/components/Modal/ProviderModal/ProviderModal";
import { Provider } from "@/src/components/Types/AppUser";
import { firestore } from "@/src/firebase/clientApp";
import { Flex, Button, Spinner } from "@chakra-ui/react";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

type ProviderDBProps = {};

const ProviderDB: React.FC<ProviderDBProps> = () => {
  const [loading, setLoading] = useState(false);

  const [providerState, setProviderState] = useRecoilState(providerModalState);

  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    // When closing modal, updates local setProviders
    if (!providerState.open && providerState.context !== undefined) {
      const modifyIndex = providers?.findIndex((item) => {
        return item.providerId === providerState?.context?.providerId;
      });
      switch (providerState.action) {
        case "create":
          setProviders(
            (prev) => [...prev, providerState.context] as Provider[]
          );
          return;
        case "modify":
          if (modifyIndex! > -1) {
            setProviders(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  providerState.context,
                  ...prev.slice(modifyIndex + 1),
                ] as Provider[]
            );
          }
          return;
        case "delete":
          if (modifyIndex! > -1) {
            setProviders(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  ...prev.slice(modifyIndex + 1),
                ] as Provider[]
            );
          }
          return;
      }
      setProviderState((prev) => ({
        ...prev,
        context: undefined,
        action: undefined,
      }));
    }
  }, [providerState.open]);

  const getProviders = async () => {
    setLoading(true);
    try {
      const queryRef = query(collection(firestore, "providers"));
      const providerDocs = await getDocs(queryRef);
      const providers = providerDocs.docs.map((doc) => ({
        providerId: doc.id,
        ...doc.data(),
      }));
      setProviders(providers as Provider[]);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    getProviders();
  }, []);

  useEffect(() => {}, [providers]);

  const onClick = (item: Provider) => {
    setProviderState((prev) => ({
      ...prev,
      open: true,
      context: item,
      action: "modify",
    }));
  };
  return (
    <>
      <ProviderModal />
      <Flex direction="column" align="center" width="100%" height="100%">
        <Button
          onClick={() =>
            setProviderState((prev) => ({
              ...prev,
              open: true,
              context: undefined,
            }))
          }
        >
          Crea nou provider
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
                {providers.map((item) => {
                  return (
                    <ProviderElement
                      key={item.providerId}
                      provider={item}
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
export default ProviderDB;
