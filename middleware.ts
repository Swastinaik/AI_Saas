import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NEXT_BODY_SUFFIX } from 'next/dist/lib/constants'
import { NextResponse } from 'next/server'


const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  
])

const isPublicApiRoute = createRouteMatcher([
  "/api/videos"
])

export default clerkMiddleware(async (auth, request)=> {
  const {userId} = await auth()
  const currentURL = new URL(request.url)
  const isAccessingDashboard = currentURL.pathname === '/'
  const isApiRequest = currentURL.pathname.startsWith('/api')

  //for user who are loggd in but accessing public routes
  if(userId &&  isPublicRoute(request) && !isAccessingDashboard){
    return NextResponse.redirect(new URL('/', request.url))
  }
  if(!userId){
    // if user is not logged in but trying t access the protected routes
    if(!isPublicApiRoute(request) && !isPublicRoute(request)){
      return NextResponse.redirect(new URL('/https://loved-bedbug-10.accounts.dev/sign-in', request.url))
    }
    // if user trying to access protected api request but not loggd in
    if(isApiRequest && !isPublicApiRoute(request)){
      return NextResponse.redirect(new URL('/https://loved-bedbug-10.accounts.dev/sign-in', request.url))
    }
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}