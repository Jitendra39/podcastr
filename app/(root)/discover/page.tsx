"use client"

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import Searchbar from '@/components/Searchbar'
import { podcastData } from '@/constant'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

function  Discover({ searchParams: { search } }: { searchParams: { search: string } }) {
  const podcastsData = useQuery(api.podcast.getPodcastBySearch, { search: search || '' });
  return (
    <div className='flex flex-col gap-9'>
      <Searchbar/>
     <div className="flex flex-col gap-9">
     <h1 className="text-20 font-bold text-white-1">
      {!search ? "Discover Trending Podcasts" : "Search Results for: "}
      {
        search && <span className='text-white-1'>{search}</span>
      }
     </h1>
     {
      podcastData ? (
        <>
        {podcastData.length > 0 ? (
           <div className="podcast_grid">
           {podcastsData?.map(({_id, imageUrl,podcastTitle, podcastDescription}) => (
              <PodcastCard
              key={_id}
               imgURL={imageUrl}
               title={podcastTitle}
               description={podcastDescription}
               PodcastId={_id}
        
               />
            ))}
           </div>
        ) : (<EmptyState title="No result Found" />)
        }
        </>
      ) : <LoaderSpinner/>
     }
     </div>
</div>
  )
}

export default Discover