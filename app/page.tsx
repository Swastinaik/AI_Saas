"use client"
import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'
import Link from 'next/link'
import { sidebarServices } from './sidebar'
function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get("/api/videos")
            if(Array.isArray(response.data)) {
                setVideos(response.data)
            } else {
                throw new Error(" Unexpected response format");

            }
        } catch (error) {
            console.log(error);
            setError("Failed to fetch videos")

        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchVideos()
    }, [fetchVideos])

    const handleDownload = (url: string, title: string) => {
        () => {
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${title}.mp4`);
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }

    }

    if(loading){
        return <div>Loading...</div>
    }

    return (
      <div className='h-scrren w-full flex flex-row flex-1 '>
        <div className='w-1/4 flex flex-col gap-3 bg-[#222222]'>
          <h2 className='text-2xl font-bold text-center mt-3'>Services</h2>
          <div className='flex flex-col gap-2 p-2'>
            {sidebarServices.map((service)=>(
              <Link key={service.name} className='cursor-pointer rounded-md bg-[#1DCD9F] p-1 text-center text-black font-bold' href={service.href}>{service.name}</Link>
            ))}
          </div>
        </div>
        <div className="container h-screen  mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Videos</h1>
          {videos.length === 0 ? (
            <div className=" flex flex-col text-center text-lg text-gray-500">
              No videos available
              <Link href={'/video-upload'}>
                <button className='p-1 rounded-sm cursor-pointer bg-black'>Upload Video</button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                videos.map((video) => (
                    <VideoCard
                        key={video.id}
                        video={video}
                        onDownload={handleDownload}
                    />
                ))
              }
            </div>
          )}
        </div>
        </div>
      );
}

export default Home
