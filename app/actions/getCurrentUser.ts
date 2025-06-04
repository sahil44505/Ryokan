
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/libs/prismadb";



export default async function getCurrentUser() {
   try{
   
    const {getUser} = getKindeServerSession();
<<<<<<< HEAD
   
    const user = await getUser();
    if (!user || !user.id) return null;
    console.log("User:", user.id);
  
 
=======
    const user = await getUser();
    
    if (!user || user == null || !user.id)
        return 0

>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
    let dbUser = await prisma.user.findUnique({
        where: {kindeId: user.id}
    });

    if (!dbUser) {
<<<<<<< HEAD
       return null
    }
    
    
    console.log("Current user:", dbUser);
=======
       return 0
    }
    

>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
    return dbUser;

    

   }catch(e){
    console.log(e)
   }
}