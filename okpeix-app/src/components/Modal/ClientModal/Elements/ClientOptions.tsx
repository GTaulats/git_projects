import {
  Button,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import ConfirmModal from "../../ConfirmModal";
import { auth, firestore } from "@/src/firebase/clientApp";
import { deleteDoc, doc, runTransaction, setDoc } from "firebase/firestore";
import { uniqueId } from "@/src/algorithms/uniqueId";
import { Client } from "@/src/components/Types/AppUser";
import { useSetRecoilState } from "recoil";
import { clientModalState } from "@/src/atoms/objectAtoms/clientModalAtom";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";

type ClientOptionsProps = {
  contextClient: Client;
  setError: (error: string) => void;
};

const ClientOptions: React.FC<ClientOptionsProps> = ({
  contextClient,
  setError,
}) => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [client, setClient] = useState<Client>(contextClient as Client);
  const setClientModal = useSetRecoilState(clientModalState);

  const [openConfirm, setOpenConfirm] = useState<string[] | undefined>(
    undefined
  );
  const [confirmChoice, setConfirmChoice] = useState<
    undefined | [string, boolean]
  >(undefined);

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  // adds entry at firestore /users since can't access directly authent.
  const createUserDocument = async (user: any) => {
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
    // Save user.uid in Client's firebaseUserId
  };

  // Execute when userCred is assigned. Updates client entry
  useEffect(() => {
    console.log("wth", userCred);
    if (userCred) {
      console.log("yooo");
      // Creates user in Firebase Authentification. Appends corresponding ID
      createUserDocument({
        ...userCred.user,
        clientId: contextClient.clientId,
      });

      // Assigns the Authentification uid to the client
      const func = async () => {
        console.log("firebaseUserId");
        const clientDocRef = doc(firestore, "clients", contextClient.clientId);

        await setDoc(clientDocRef, {
          ...client,
          firebaseUserId: userCred?.user.uid,
        } as Client); // Dunno why it won't update by using setClient

        setClientModal((prev) => ({
          ...prev,
          open: false,
          context: { ...client, firebaseUserId: userCred?.user.uid } as Client,
          action: "modify",
        }));
      };
      func();
    }
  }, [userCred]);

  useEffect(() => {
    if (confirmChoice && confirmChoice[1]) {
      if (confirmChoice[0] === "delete") delClient();
      if (confirmChoice[0] === "login") loginClient();
      // if (confirmChoice[0] === "revoke") revokeClient();
    }
  }, [confirmChoice]);

  // TODO
  // const revokeClient = () => {
  //   // Deletes user linked to the client and updates the client
  //   setConfirmChoice(undefined);
  //   setOpenConfirm(undefined);
  //   setError("");
  // };

  const loginClient = async () => {
    // Creates a firebase user by using the inputed email account.
    // A random password is generated, and an email is sent to the client for it to be used to login.

    setConfirmChoice(undefined);
    setOpenConfirm(undefined);
    setError("");
    if (
      !contextClient.email ||
      contextClient.email == "" ||
      contextClient.email === undefined
    ) {
      console.log("Cal un correu electrònic per vincular el client");
      setError("Cal un correu electrònic per vincular el client");
      return;
    }

    // TODO: Hide this newPassword in backend
    const newPassword = uniqueId().substring(3); // Default password for login

    setLoginLoading(true);

    // adds entry at authentification in firebase
    console.log("hey yoo");
    createUserWithEmailAndPassword(
      contextClient.email!, // Email for login
      newPassword
    );

    try {
      // Send password to client via email
      // TODO: Insert link to okpeix-app
      // TODO: Make dedicated function for email sending
      const data = {
        name: contextClient.name,
        email: contextClient.email,
        message: `Hola! S'ha habilitat el seu accés a okpeix-app. Ara pot accedir a la pàgina emprant el seu correu electrònic i la següent contrasenya: ${newPassword}. Recordi de no compartir-la mai. Qualsevol incidència ho pot fer saber responent a aquest correu o contactant amb els empleats d'Ok Peix. Gràcies per confiar en nosaltres.`,
        html: `
          <div>
            <p>Hola! S'ha habilitat el seu accés a okpeix-app.</p>
            <p>
              Ara pot accedir a la pàgina per realitzar comandes i seguir el seu
              estat.
            </p>
            <p>
              Utilitzi el correu electrònic amb el qual li notifiquem (${contextClient.email}) i la següent contrasenya:
            </p>
            <div
              style={{
                justifyItems: "center",
                fontSize: "16pt",
                fontWeight: "bold",
              }}
            >
              <b>${newPassword}</b>
            </div>
            <p>
              Recordi de protegir la seva privacitat i seguretat, i de no
              compartir aquesta informació.
            </p>
            <p>
              Qualsevol incidència ho pot fer saber responent a aquest correu o
              contactant amb els empleats d'Ok Peix.
            </p>
            <p>Gràcies per confiar en nosaltres.</p>
          </div>
        `,
      };
      const req = {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      } as RequestInit;

      fetch("/api/email", req).then((res) => {
        if (res.status === 200) {
          console.log("Response succeeded!");
        } else {
          console.log("Response failed...");
        }
      });

      console.log(`User ${contextClient.name} linked successfuly`);
    } catch (error: any) {
      setError(String(error));
      console.log("handleCreate error", error);
    }

    setLoginLoading(false);
  };

  const duplicateClient = async () => {
    const newId = uniqueId();
    setClient((prev) => ({
      ...prev,
      clientId: newId,
    }));

    setDupLoading(true);
    try {
      const clientDocRef = doc(firestore, "clients", newId);

      await runTransaction(firestore, async (transaction) => {
        const clientDoc = await transaction.get(clientDocRef);
        if (clientDoc.exists()) {
          throw new Error(`Client ja existent.`);
        }

        // Create client
        transaction.set(clientDocRef, { ...client, clientId: newId }); // Dunno why it won't update by using setClient

        setClientModal((prev) => ({
          ...prev,
          open: false,
          context: { ...client, clientId: newId },
          action: "create",
        }));
      });
      console.log(`"${client.name}" client successfuly duplicated`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDupLoading(false);
  };

  const delClient = async () => {
    setConfirmChoice(undefined);
    setDelLoading(true);
    try {
      const clientDocRef = doc(firestore, "clients", client.clientId);
      await deleteDoc(clientDocRef);

      setClientModal((prev) => ({
        ...prev,
        open: false,
        action: "delete",
      }));

      console.log(`"${client.name}" client successfuly deleted`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDelLoading(false);
  };

  const handleClose = () => {
    setClientModal((prev) => ({
      ...prev,
      open: false,
      action: undefined,
    }));
  };

  return (
    <>
      {openConfirm && (
        <ConfirmModal
          isOpen={openConfirm !== undefined}
          message={openConfirm[1]}
          onClose={() => {
            setOpenConfirm(undefined);
          }}
          setChoice={(choice: boolean) => {
            setConfirmChoice([openConfirm[0], choice]);
          }}
        />
      )}
      <Popover>
        <PopoverTrigger>
          <Flex
            borderRadius="full"
            p="7px"
            height="min-content"
            width="min-content"
            align="center"
            m="auto 0"
            mr={2}
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
          >
            <Icon as={BsThreeDots} />
          </Flex>
        </PopoverTrigger>
        <PopoverContent height="min-content" width="min-content">
          <PopoverArrow />
          <PopoverBody>
            <Stack>
              <Button onClick={duplicateClient} isLoading={dupLoading}>
                Duplica client
              </Button>
              {client.firebaseUserId ? (
                // TODO
                <Button
                  color="red.400"
                  onClick={() =>
                    setOpenConfirm([
                      "revoke",
                      "Impediràs l'accés d'aquest client a l'aplicatiu. Procedir?",
                    ])
                  }
                  isLoading={loginLoading}
                >
                  Deshabilita inici sessió
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    setOpenConfirm([
                      "login",
                      "Habilitaràs al client accedir a aquest aplicatiu web. Un correu se l'enviarà amb la contrasenya. Procedir?",
                    ])
                  }
                  isLoading={loginLoading}
                >
                  Habilita inici sessió
                </Button>
              )}
              <Button
                color="red.400"
                onClick={() =>
                  setOpenConfirm([
                    "delete",
                    "Segur que vols eliminar el client? No es podrà recuperar",
                  ])
                }
                isLoading={delLoading}
              >
                Elimina client
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default ClientOptions;
