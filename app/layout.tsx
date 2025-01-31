

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import getCurrentUser from "./actions/getCurrentUser";
import { Toaster } from "sonner";
import Hero from "./components/Hero/Hero";
import Categories from "./components/navbar/Categories";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser :any = await getCurrentUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Navbar currentUser = {currentUser} />
          <Hero/>
          <Categories/>
         
        {children}
        <Toaster richColors />
        
         
      </body>
    </html>
  );
}
