import { NextResponse } from "next/server";

//we will use this to check if the origin of the request is valid before accepting it
const allowedOrigins = process.env.NODE_ENV === "production" 
    ? ["https://www.yoursite.com", "https://yoursite.com"] :
    ["http://localhost:3000"]

export function middleware(request: Request) {
    const origin = request.headers.get('origin');

    if (request.url.includes('/api/')) {
        console.log('API route')
    }

    if (origin && !allowedOrigins.includes(origin)) {
        //we block non-allowed origins
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad request",
            headers: {
                "Content-Type": "text/plain"
            }
        })
    }
    
    console.log(request.method)
    console.log(request.body)

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*" //this is matcher config to make the middleware work for specific paths. see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
}