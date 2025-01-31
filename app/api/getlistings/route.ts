'use server'
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from 'next/server';


export  async function GET (req:any)  {
  try{
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('category') || 'Null';
    console.log(query);
        const user  = getCurrentUser()
        if(!user){
            console.log('User not found')
            return 0
        }
        const listing = await prisma.listings.findMany({
            where:{
                type:query
            }
        })
        console.log(listing)
        
        return NextResponse.json(listing,{status :200})


  }catch(e){
    console.log(e)
}
    
 
}

