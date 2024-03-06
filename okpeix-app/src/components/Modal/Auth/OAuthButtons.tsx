import { Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { auth, firestore } from "@/src/firebase/clientApp";
import { FcGoogle } from "react-icons/fc";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  // Adds user to firestore db apart from authentification section
  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
    // instead of addDoc cuz google can handle new or existing cases by itself
  };

  // when userCred is modified, adds the user to the db
  useEffect(() => {
    if (userCred) createUserDocument(userCred.user);
  }, [userCred]);

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        border="1px solid gray"
        borderRadius="15px"
        bg="white"
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Icon
          as={FcGoogle}
          fontSize="20pt"
          border="1px solid"
          borderColor="gray.400"
          borderRadius="full"
          p="2px"
          mr={2}
        />
        Continue with Google
      </Button>
      <Button border="1px solid gray" borderRadius="15px" bg="white">
        Some Other Provider
      </Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
};
export default OAuthButtons;
