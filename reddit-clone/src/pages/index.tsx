import { communityState } from "@/atoms/communitiesAtom";
import { Post, PostVote } from "@/atoms/postsAtom";
import CreatePostLink from "@/components/Community/CreatePostLink";
import PersonalHome from "@/components/Community/PersonalHome";
import Premium from "@/components/Community/Premium";
import Recomendations from "@/components/Community/Recomendations";
import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Navbar/Posts/PostItem";
import PostLoader from "@/components/Navbar/Posts/PostLoader";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import { collection, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote
  } = usePosts();
  const {communityStateValue} = useCommunityData();

  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        // get posts from users' communities
        const myCommunityIds = communityStateValue.mySnippets.map(
          snippet => snippet.communityId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPostStateValue(prev => ({
          ...prev,
          posts: posts as Post[]
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log("buildUserHomeFeed error", error);
    }
    setLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setLoading(true)
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      )
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[]
      }))

    } catch (error) {
      console.log("buildNoUserHomeFeed error", error);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map(post => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      )
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPostStateValue(prev => ({
        ...prev,
        postVotes: postVotes as PostVote[]
      }))
    } catch (error) {
      console.log("getUserPostVotes error", error);
    }
  };
  
  // useEffects to manage the data flow
  useEffect(()=>{
    if (communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched]);

  useEffect(()=>{
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(()=>{
    if (user && postStateValue.posts.length) getUserPostVotes();

    return () => { // executes when leaving the page. Known as cleanup function
      setPostStateValue(prev => ({
        ...prev,
        postsVotes: []
      }))
    }
  }, [user, postStateValue.posts]);

  return (
    <PageContent>
      <>
      <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map(post => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={postStateValue.postVotes.find(
                  item => item.postId === post.id
                )?.voteValue}
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5}>
        <Recomendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  )
}

export default Home;