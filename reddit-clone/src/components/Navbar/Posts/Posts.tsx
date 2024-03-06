import { Community } from '@/atoms/communitiesAtom';
import { Post } from '@/atoms/postsAtom';
import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Stack } from '@chakra-ui/react';
import PostLoader from './PostLoader';

type PostsProps = {
  communityData: Community;
};

const Posts:React.FC<PostsProps> = ({communityData}) => {
  // useAuthState to retrieve user info
  const [user] = useAuthState(auth);

  const [loading, setLoading] = useState(false);
  const {
    postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost
  } = usePosts();

  const getPosts = async () => {
    setLoading(true)
    // get posts for this community
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      ); // Sets ref of what to get from the db
      const postDocs = await getDocs(postQuery); // retrieve data by using the ref

      // Store in post state
      const posts = postDocs.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[]
      }));

      console.log("posts", posts);
      
    } catch (error: any) {
      console.log("getPost error", error.message);
      
    }
    setLoading(false)
  };

  useEffect(()=> {
    getPosts();
  }, [communityData]);

  return (
    <>
    {loading ? (
      <PostLoader />
    ) : (
      <Stack>
        {postStateValue.posts.map(item => 
          <PostItem
            key={item.id}
            post={item}
            userIsCreator={user?.uid === item.creatorId}
            userVoteValue={postStateValue.postVotes.find(
              vote => vote.postId === item.id
            )?.voteValue
          }
            onVote={onVote}
            onSelectPost={onSelectPost}
            onDeletePost={onDeletePost}
          />
        )}
      </Stack>
    )}
    </>
  )
}
export default Posts;