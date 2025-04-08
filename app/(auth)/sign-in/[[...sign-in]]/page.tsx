import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className='h-screen w-full flex flex-center items-center place-items-center'>
    <SignIn />
  </div>
}