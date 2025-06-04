<<<<<<< HEAD
=======


>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import getCurrentUser from "./actions/getCurrentUser";
import { Toaster } from "sonner";
<<<<<<< HEAD
import { TripProvider } from "@/context/Tripscontext";
import { HotelProvider } from "@/context/Hotelscontext";
=======
import Hero from "./components/Hero/Hero";
import Categories from "./components/navbar/Categories";

>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

<<<<<<< HEAD
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const currentUser: any = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <HotelProvider>
      <TripProvider>
        <Navbar currentUser={currentUser} />
        <main>{children}</main>
        </TripProvider>
        </HotelProvider>
        <Toaster richColors />
=======


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
        
         
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
      </body>
    </html>
  );
}
