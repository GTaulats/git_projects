/*
  Data structure of Reddit: each user has info about communities, and the commu-
  nities themselves has info about the users: any-to-any data structure.
  - Communities collection will have an ID and a total number of users subs-
    cribed to it
  - Users collection will have an ID and an object with entries about the co-
    mmunity and any data needed to store about them (ie. photoURL).
    Therefore, the user collection has subcollections called communitySnippets.
*/

import { Text, Box, Button, Flex, Icon, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Input, Stack, Checkbox } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import {HiLockClosed} from "react-icons/hi"
import { GrAdd } from 'react-icons/gr';
import { auth, firestore } from '@/firebase/clientApp';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import useDirectory from '@/hooks/useDirectory';

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal:React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose
}) => {
  const [user] = useAuthState(auth);
  const [communityName, setCommunityName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router=useRouter();
  const {toggleMenuOpen} = useDirectory();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // how many chars we have left for name
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  }

  // public, restricted or private
  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name);
  }

  const handleCreateCommunity = async () => {
    if (error) setError("");
    // Validate the community name
    // Check correct format
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      setError("Community names must be between 3 and 21 characters with only letters, numbers or underscores")
      return;
    }
    
    setLoading(true);
    
    try {
      // generates the reference to the "communities" collection in firebase
      const communityDocRef = doc(firestore, "communities", communityName); // Database, collection name, ID

      // firebase transactions allows to perform consecutive actions and if any of those fails, cancels all operation made
      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        // check existance of community
        if (communityDoc.exists()) {
          throw new Error(`Sorry, r/${communityName} is taken. Try another.`)
        }
        
        // Create the community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,  // at the creation of the community, only you
          privacyType: communityType
        });

        // create communitySnippet on user
        /*
          users: collection || user.uid: object || communitySnippet: subcollection
          we store info in that communitySnippet down the tree path
        */
        transaction.set(doc(
          firestore, `users/${user?.uid}/communitySnippets`, communityName
        ), {
          communityId: communityName,
          isModerator: true  // as creator, you are moderator
        });

        // close modal and reroute to community page
        handleClose();
        toggleMenuOpen();
        router.push(`/r/${communityName}`);
      });
    } catch (error: any) {
      console.log("handleCreateCommunity", error);
      setError(error.message);
    }
    setLoading(false);
    console.log("Community successfuly created");
    
  };
    
    return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            textAlign="center"
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              padding="10px 0px"
            >
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                Community names including capitalization cannot be changed
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                r/
              </Text>
              <Input
                position="relative"
                value={communityName}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text
                fontSize="9pt"
                color={charsRemaining <= 0 ? "red" : "gray.500"}
              >
                {charsRemaining} Characters remaining
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>{error}</Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                  {/* checkbox */}
                  <Stack mt={1} spacing={2}>
                    <Checkbox
                      name="public"
                      isChecked={communityType=="public"}
                      onChange={onCommunityTypeChange}
                    >
                      <Flex align="center">
                        <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                        <Text fontSize={10} mr={1}>Public</Text>
                        <Text fontSize={8} color="gray.500">
                          Anyone can view, post and comment to this community
                        </Text>
                      </Flex>
                    </Checkbox>
                    <Checkbox
                      name="restricted"
                      isChecked={communityType=="restricted"}
                      onChange={onCommunityTypeChange}
                    >
                      <Flex align="center">
                        <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                        <Text fontSize={10} mr={1}>Restricted</Text>
                        <Text fontSize={8} color="gray.500">
                          Anyone can view this community, but only approved users 
                          can post
                        </Text>
                      </Flex>
                    </Checkbox>
                    <Checkbox
                      name="private"
                      isChecked={communityType=="private"}
                      onChange={onCommunityTypeChange}
                    >
                      <Flex align="center">
                        <Icon as={HiLockClosed} color="gray.500" mr={2} />
                        <Text fontSize={10} mr={1}>Private</Text>
                        <Text fontSize={8} color="gray.500">
                          Only approved users can view and submit to this 
                          community
                        </Text>
                      </Flex>
                    </Checkbox>
                  </Stack>
                </Text>
              </Box>
            </ModalBody>
          </Box>
          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >Create Community</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default CreateCommunityModal;