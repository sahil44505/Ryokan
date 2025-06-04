'use server'
import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

<<<<<<< HEAD
export async function getListings() {
    try {
        const user = getCurrentUser()
        if (!user) {
=======
export  async function getListings ()  {
  try{
        const user  = getCurrentUser()
        if(!user){
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
            console.log('User not found')
            return 0
        }
        const listing = await prisma.listings.findMany({
<<<<<<< HEAD
            where: {
                type: "Beach"
            }
        })
        console.log(listing)
        


    } catch (e) {
        console.log(e)
    }


=======
            where:{
                type:"Beach"
            }
        })
        console.log(listing)
        return listing


  }catch(e){
    console.log(e)
}
    
 
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
}

