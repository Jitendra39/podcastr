"use client"

import PodcastCard from '@/components/PodcastCard'
import React from 'react'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
 


function Home() {
  const trendingPodcast = useQuery(api.podcast.getTrendingPodcasts);


  return (
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>



   <div className="podcast_grid">
   {trendingPodcast?.map(({_id, imageUrl,podcastTitle, podcastDescription}) => (
      <PodcastCard
      key={_id}
       imgURL={imageUrl}
       title={podcastTitle}
       description={podcastDescription}
       PodcastId={_id}

       />
    ))}
   </div>
    
      </section>
    </div>
  )
}

export default Home