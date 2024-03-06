import { authModalState } from '@/atoms/authModalAtom';
import { Community, CommunitySnippet, communityState } from '@/atoms/communitiesAtom';
import { auth, firestore } from '@/firebase/clientApp';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';

// :React.FC removed since it doesn't return a funcitonal component (notice brackets in return)
const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const onJoinOrLeaveCommunity = (
    communityData: Community, isJoined: boolean
  ) => {
    // is user signed in?
      // if not => open auth modal
    if (!user) {
      // open modal
      setAuthModalState({open: true, view: "login"})
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  }

  const getMySnippets = async () => {
    try {
      // get users snippets
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map(doc => ({...doc.data()}));
        setCommunityStateValue(prev => ({
          ...prev,
          mySnippets: snippets as CommunitySnippet[],
          snippetsFetched: true
        }))


      console.log("snippets", snippets)
    } catch (error: any) {
      console.log("getMySnippets error", error);
      setError(error.message);
    }
  };

  const joinCommunity = async (communityData: Community) => {
    // batch write
      // add a new community snippet for this user
      // update the number of members on the joined community (+1)
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid === communityData.creatorId
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1)
      });

      await batch.commit();
      
      // update recoil state - communityState.mySnippets
      setCommunityStateValue(prev => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));

    } catch (error: any) {
      console.log("joinCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
  };
  const leaveCommunity = async (communityId: string) => {
    // batch write
      // remove community snippet from this user
      // update the number of members on the joined community (-1)
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityId
        )
      )

      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1)
      });

      await batch.commit();
      
      // update recoil state - communityState.mySnippets
      setCommunityStateValue(prev => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          item => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("leaveCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId)
      const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue(prev => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id, ...communityDoc.data()
        } as Community
      }))
    } catch (error) {
      console.log("getCommunityData error", error);
      
    }
  }

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [], // voids user related data without removing currentCommunity
        snippetsFetched: false
      }));
      return
    };
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const {communityId} = router.query;
    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity])

  return {
    // data and functions shared across many components
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading
  }
}
export default useCommunityData;