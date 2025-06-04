'use server'
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from 'next/server';


export  async function GET (req:any)  {
  try{
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('category') || 'Null';
<<<<<<< HEAD

=======
    console.log(query);
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
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
<<<<<<< HEAD
        
        
       
        
=======
        console.log(listing)
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
        
        return NextResponse.json(listing,{status :200})


  }catch(e){
    console.log(e)
}
    
 
}

