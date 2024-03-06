import { authModalState } from '@/atoms/authModalAtom';
import { communityState } from '@/atoms/communitiesAtom';
import { Post, PostVote, postState } from '@/atoms/postsAtom';
import { auth, firestore, storage } from '@/firebase/clientApp';
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useDragControls } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const usePosts = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const setAuthModalState = useSetRecoilState(authModalState);

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    
    event.stopPropagation();

    // check if user is logged in
    if (!user?.uid) {
      setAuthModalState({open: true, view:"login"})
      return
    }

    try {

      const {voteStatus} = post;
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id  // checks if user voted the post
      );

      const batch = writeBatch(firestore);
      const updatedPost = {...post};
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      // if statements modifies the initial values
      if (!existingVote) {
        // create a new postVote document
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote, // 1 or -1
        };

        batch.set(postVoteRef, newVote);
        
        // add/substract 1 to/from post.voteStatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];

        // create a new postVote document
      } else { // user already voted
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        // Removing their vote (up => neutral OR down => neutral)
        if (existingVote.voteValue === vote) {
          // add/substract 1 to/from post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          // delete the postVote document
          batch.delete(postVoteRef);
          voteChange *= -1;
        } else { // user flips its vote
          // add/substract 2 to/from post.voteStatus
          updatedPost.voteStatus = voteStatus + 2*vote;

          const voteIndex = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          updatedPostVotes[voteIndex] = {
            ...existingVote,
            voteValue: vote,
          };

          // updating the existing postVote document
          batch.update(postVoteRef, {
            voteValue: vote,
          })
        }
      }
      // update vote number at posts
      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, {voteStatus: voteStatus + voteChange})

      await batch.commit();

      // update state with updated values
      const postIndex = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIndex] = updatedPost;
      setPostStateValue(prev => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));

      if (postStateValue.selectedPost) { // takes votes if in single post view
        setPostStateValue(prev => ({
          ...prev,
          selectedPost: updatedPost,
        }))
      }

    } catch (error) {
      console.log("onVote error", error);
      
    }

  };

  const onSelectPost = (post: Post) => { // reach single post view
    setPostStateValue(prev => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`)
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if post to delete has image
      if (post.imageURL) {
        // delete image from firestore
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // delete post document in firestore
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      // deletes post from temp
      setPostStateValue(prev => ({
        ...prev,
        posts: prev.posts.filter(item => item.id !== post.id)
      }))

      return true;
    } catch (error) {
      return false;
    }

  };

  const getCommunityPostVote = async (communityId: string) => { // fetch votes user has
    const postVotesQuery = query(
      collection(
        firestore,
        "users",
        `${user?.uid}/postVotes`
      ), where("communityId", "==", communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPostStateValue(prev => ({
      ...prev,
      postVotes: postVotes as PostVote[]
    }))
  }

  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getCommunityPostVote(currentCommunity?.id);
  }, [user, currentCommunity]);

  useEffect(() => {
    if (!user) {
      // clear user post votes
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: []
      }))
    }
  }, [user]); // triggers every time "user" changes

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost
  }
}
export default usePosts;