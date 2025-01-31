<<<<<<< HEAD
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(async function middleware(req: NextRequest){

},{
    isReturnToCurrentPage: true,
})

export const config = {
    matcher:[
        '/random',

    ]
=======
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(async function middleware(req: NextRequest){

},{
    isReturnToCurrentPage: true,
})

export const config = {
    matcher:[
        '/random',

    ]
>>>>>>> e2e39cc47e4e07420d8618d5ac1cffe754c2e476
}