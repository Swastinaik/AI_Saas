'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
const page = () => {
    const [file, setFile] = React.useState<File | null>(null)
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [isUploading, setIsuploading] = React.useState(false)

    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault()
        setIsuploading(true)
        
        if(!file) {
            throw new Error("File didn't get uploaded")
        }
        const MAX_FILE_SIZE = 60 * 1024 * 1024
        if(file.size > MAX_FILE_SIZE){
            throw new Error("File is too large to upload")
        }
        const formData = new FormData()
        formData.append("file", file)
        formData.append("title", title)
        formData.append("description", description)
        try {
            const response = await axios.post("/api/video-upload", formData)
            router.push("/")
        } catch (error) {
            console.log("Error while uploading the video ---------- ", error)
            throw new Error("Falied to upload video")
        } finally{
          setIsuploading(false)
        }
    }
  return (
    <div className="mx-auto p-7 h-screen w-full flex flex-col gap-2">
    <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Video File</span>
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file-input file-input-bordered w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Video"}
      </button>
    </form>
  </div>
  )
}

export default page