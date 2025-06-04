'use client'
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import Hero from "./components/Hero/Hero";
import Categories from "./components/navbar/Categories";

import SearchHero from "./components/search/SearchHero";
import Nearby from "./components/Nearby";
import CategoryHeader from "./components/CategoryHeader";



export default function Home() {
  const [nearbyHotels, setNearbyHotels] = useState<any[]>([]);
=======

export default function Home() {
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch('/api/auth-check');
      const data = await response.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
      }
    }

    checkAuth();
  }, []);

<<<<<<< HEAD
 
  
 useEffect(()=>{
 
   const gettoast = () => {
    const hasShownToast =  sessionStorage.getItem("hasShownToast");
    if (hasShownToast){
      return 0
    }
    if (isAuthenticated) {
      
  
      if (!hasShownToast) {
        toast.success("Logged in successfully");
        sessionStorage.setItem("hasShownToast", "true");
      }
      
    }else{ 
    if(hasShownToast){
      sessionStorage.removeItem('hasShownToast')
    }
  }
    }
  
 
  
  gettoast()
 
 

  },[isAuthenticated])
   
  
    

  return (
    <>
    <Hero/>
    
    <SearchHero setNearby={setNearbyHotels}/>
    <CategoryHeader/>
   
    
    <Categories/>
    <Nearby hotels={nearbyHotels}/>
=======
  useEffect(() => {
    if (isAuthenticated) {
      const hasShownToast = localStorage.getItem('hasShownToast');
      if (!hasShownToast) {
      toast.success("Logged in successfully");
      localStorage.setItem('hasShownToast', 'true');
    }
    localStorage.removeItem('hasShownToast');
    }
  }, [isAuthenticated]);

  return (
    <>
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
     
    </>
  );
}
