'use client'
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";

export default function Home() {
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
     
    </>
  );
}
