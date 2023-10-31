import { NextResponse } from "next/server";

export function middleware(request: Request) {
    console.log(request.method)
    console.log(request.body)
    
    return NextResponse.next();
}