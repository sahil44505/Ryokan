<<<<<<< HEAD
"use client";
import { User } from "@prisma/client";
import Container from "./Container";
import Logo from "./Logo";
import SearchHero from "../search/SearchHero";
import TagsSearch from "./TagsSearch";
import UserMenu from "./UserMenu";
import { useEffect, useState } from "react";

interface NavbarProps {
  currentUser?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSearch(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full bg-white z-50 shadow-sm transition-all duration-300 ${showSearch ? "h-24" : "h-24"}`}>
      <div className="py-4 px-6">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3">
            <Logo />

            {/* Navbar SearchHero appears after scrolling */}
            {showSearch && (
              <div className="w-[400px]">
                <SearchHero isNavbarMode={true} setNearby={function (data: any[]): void {
                  throw new Error("Function not implemented.");
                } } />
              </div>
            )}

            <TagsSearch />
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
=======
'use client'
import { User } from "@prisma/client"
import Container from "./Container"
import Logo from "./Logo"
import Search from "./Search"
import UserMenu from "./UserMenu"


interface NavbarProps {
  currentUser? : User | null
}

const Navbar :React.FC<NavbarProps> = ({currentUser}) => {
 
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container >
          
          <div className=" flex
          flex-row
          items-center
          justify-between
          gap-3
          md:gap-0">
            <Logo />
            <Search />
            <UserMenu currentUser={currentUser}/>
          
          </div>
        </Container>

      </div>
     
     
    </div>
  )
}

export default Navbar
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
