import { Community, communityState } from '@/atoms/communitiesAtom';
import About from '@/components/Community/About';
import CreatePostLink from '@/components/Community/CreatePostLink';
import Header from '@/components/Community/Header';
import NotFound from '@/components/Community/NotFound';
import PageContent from '@/components/Layout/PageContent';
import Posts from '@/components/Navbar/Posts/Posts';
import { firestore } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

type communityPageProps = {
  communityData: Community;
};
const communityPage:React.FC<communityPageProps> = ({communityData}) => {
  console.log("communityData", communityData);
  const setCommunityStateValue = useSetRecoilState(communityState);

  if (!communityData) {
    return <NotFound />;
  }

  useEffect(() => {
    setCommunityStateValue(prev => ({
      ...prev,
      currentCommunity: communityData,
    }))
  }, [communityData]);

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  )
}

 // we can access the dynamic name from "context"
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data and pass it to client
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    // what the user will see
    return {
      props: {
        communityData: communityDoc.exists() ?
        JSON.parse(JSON.stringify({
          id: communityDoc.id,
          ...communityDoc.data()
        }))
        : "",
      }
    }
  } catch (error) {
    // Could add error page here
    console.log("getServerSideProps error", error)
  }
}

export default communityPage;