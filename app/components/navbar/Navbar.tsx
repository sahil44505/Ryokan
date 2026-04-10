"use client";
import { User } from "@prisma/client";
import Container from "./Container";
import Logo from "./Logo";
import TagsSearch from "./TagsSearch";
import UserMenu from "./UserMenu";

interface NavbarProps {
  currentUser?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  // --- SCROLL LOGIC REMOVED ---
  // Deleted showSearch state and the useEffect scroll listener

  return (
    <div className="top-0 left-0 w-full bg-white z-50 shadow-sm transition-all duration-300 h-24">
      <div className="py-4 px-6">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3">
            <Logo />


            <TagsSearch />
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;