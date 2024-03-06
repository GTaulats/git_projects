import { Alert, AlertDescription, AlertIcon, AlertTitle, CloseButton, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsLink45Deg } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { BiPoll } from 'react-icons/bi';
import { BsMic } from 'react-icons/bs';
import TabItem from './TabItem';
import { _TabItem } from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from "./PostForm/ImageUpload";
import { Post } from '@/atoms/postsAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Timestamp, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { firestore, storage } from '@/firebase/clientApp';
import useSelectFile from '@/hooks/useSelectFile';
import { log } from 'console';

type NewPostFormProps = {
  user: User // TS usually screams at this, but it's being protected 
             // from the source
  communityImageURL?: string;
};

const formTabs: _TabItem[] = [
  {
    title: "Post",
    icon: IoDocumentText
  },
  {
    title: "Images & Video",
    icon: IoImageOutline
  },
  {
    title: "Link",
    icon: BsLink45Deg
  },
  {
    title: "Poll",
    icon: BiPoll
  },
  {
    title: "Talk",
    icon: BsMic
  },
]

const NewPostForm:React.FC<NewPostFormProps> = ({user, communityImageURL}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  
  const {selectedFile, setSelectedFile, onSelectFile} = useSelectFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCreatePost = async () => {

    const {communityId} = router.query;
    
    // create new post object => type Post
    const newPost: Post = {
      communityId: communityId as string,
      communityImageURL: communityImageURL || "",
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split("@")[0], // the ! makes TS ignore it
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp
    };

    // store the post in db in post collection
    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      
      // check for selectedFile
      if (selectedFile) {
        // update post doc by adding imageURL
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // store in storage => getDownloadURL (return imageURL)
        await updateDoc(postDocRef, {
          imageURL: downloadURL
        });
        // redirect the user to the communityPage using the router
      }
      router.push(`/r/${communityId}`);
    } catch (error: any) {
      console.log("handleCreatePost error", error);
      setError(true);
    }
    setLoading(false);
    
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {target: {name, value}} = event;
    setTextInputs(prev => ({
      ...prev,
      [name]: value,
    }))
  };

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      mt={2}
    >
      <Flex width="100%">
        {formTabs.map(item => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" &&
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        }
        {selectedTab === "Images & Video" &&
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
          />
        }
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text mr={2}>Error creating post</Text>
        </Alert>
      )}
    </Flex>  
  )
}
export default NewPostForm;