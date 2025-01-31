
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/libs/prismadb";



export default async function getCurrentUser() {
   try{
   
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    
    if (!user || user == null || !user.id)
        return 0

    let dbUser = await prisma.user.findUnique({
        where: {kindeId: user.id}
    });

    if (!dbUser) {
       return 0
    }
    

    return dbUser;

    

   }catch(e){
    console.log(e)
   }
}