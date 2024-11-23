"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import ProfileCard from "@/components/ProfileCard";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const podcastsData = useQuery(api.podcast.getPodcastByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !podcastsData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData?.podcasts
              ?.slice(0, 4)
              .map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  imgURL={podcast.imageUrl!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  PodcastId={podcast._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;

// "use client"

// import { Button } from '@/components/ui/button';
// import { api } from '@/convex/_generated/api';
// import { useUser } from '@clerk/nextjs';
// import { useQuery } from 'convex/react';
// import Image from 'next/image'
// import React from 'react'

// function Profile({ params: { profileId } }: { params: { profileId: string } }) {
//   const { user } = useUser();

//   const userData = useQuery(api.users.getUserById, { clerkId: profileId })
//   const userPodcast = useQuery(api.podcast.getPodcastByAuthorId, { authorId: profileId })
//   console.log(userPodcast)

//   return (
//     <div className=''>
//       <h1 className='text-xl mt-5 font-bold text-white-1'>Podcaster Profile</h1>

//       <div className="flex mt-5">
//         <div>
//           <Image
//             src={userData?.imageUrl || ''}
//             width={174}
//             height={174}
//             alt='profile Image'
//             className='aspect-square rounded-lg'
//           />
//         </div>
//         <div className='gap-5'>
//           <h2 className='text-white-1 text-3xl font-bold'>{userData?.name}</h2>
//           <figure className='flex gap-3'>
//             <Image
//               src="/icons/headphone.svg"
//               width={24}
//               height={24}
//               alt='headphone'
//             />
//             <h2 className='text-16 font-bold text-white-1'>
//               {userPodcast?.listeners} Monthly Listners
//             </h2>
//           </figure>
//           <div>
//             <Button
//               className="text-16 w-full bg-orange-1 text-white-1 font-extrabold gap-2"
//             >
//               <Image
//                 src="/icons/play.svg"
//                 width={24}
//                 height={24}
//                 alt='play'
//               />
//               Play a random podcast
//             </Button>
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile