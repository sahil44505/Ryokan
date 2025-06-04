'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";




const Logo = () => {
  const router = useRouter();
   

  return (
<<<<<<< HEAD
    <>
    
    
=======
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
    <Image
    onClick={() =>router.push('/')}
    alt="Logo"
    className="hidden md:block cursor-pointer"
    height='100'
    width='100'
    src="/images/Logo.svg"
    />
<<<<<<< HEAD
       <div className="absolute left-[180px]">
      <p className=" font-bold  text-2xl ">Ryokan</p>
      </div>
 
    
    </>
=======
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
  );
}

export default Logo;
