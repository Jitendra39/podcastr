'use client'
import { PodcastCardProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

function PodcastCard({
  imgURL, title, description, PodcastId }:  PodcastCardProps) {
   const router = useRouter()

    const handleViews =() =>{           
      router.push(`/podcast/${PodcastId}`, {
        scroll: true    
      });
    }
  

  return (
    <div className='cursor-pointer ' onClick={handleViews}>
      <figure className='flex flex-col gap-3 '>
    <Image src={imgURL || '/default-image.png'} alt={title} width={174} height={174}
     className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px]'
    />
      </figure>
      <div className='flex flex-col '>
        <h1 className='text-16 font-bold truncate text-white-1 pt-2'>
          {title}
        </h1>
      <h2 className='text-12 truncate text-white-4 font-normal capitalize'>
        {description}
      </h2>

      </div>
    </div>
  )
}

export default PodcastCard



