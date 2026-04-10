'use client';

import { useCallback, useEffect, useRef, ReactNode, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { AiOutlineMenu } from "react-icons/ai";

import Avatar from "../Avatar";
import MenuItem from "./MenuItem";

interface UserMenuProps {
    currentUser?: any; // Adjusted to be flexible with Kinde/NextAuth
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Optimized toggle using functional update
    const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

    // Effect: Performance optimized click listener (Passive listener)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside, { passive: true });
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fast navigation: Closes menu immediately before triggering router
    const navigateTo = useCallback((path: string) => {
        setIsOpen(false);
        router.push(path);
    }, [router]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex flex-row items-center gap-3">
                {/* Desktop Quick Link */}
                <div
                    onClick={() => navigateTo('/reccomendations')}
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer active:scale-95"
                >
                    Recommendations
                </div>

                {/* Burger/User Icon */}
                <div
                    onClick={toggleMenu}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition active:bg-neutral-50"
                >
                    <AiOutlineMenu size={18} />
                    <div className="hidden md:block">
                        <Avatar />
                    </div>
                </div>
            </div>

            {/* Dropdown Menu - Fast Render */}
            {isOpen && (
                <div className="absolute rounded-xl shadow-xl w-[50vw] md:w-full bg-white overflow-hidden right-0 top-12 text-sm z-[100] border border-neutral-100 animate-in fade-in zoom-in duration-75">
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                            <>
                                <MenuItem 
                                    label="My Bookings" 
                                    onClick={() => navigateTo('/bookings')} 
                                />
                                <MenuItem 
                                    label="Nearby Search" 
                                    onClick={() => navigateTo('/nearby')} 
                                />
                                
                                <hr className="border-neutral-100" />
                                
                                <LogoutLink className="w-full">
                                    <div className="hover:bg-neutral-100 transition px-4 py-3 font-semibold text-rose-500">
                                        Logout
                                    </div>
                                </LogoutLink>
                            </>
                        ) : (
                            <>
                                <LoginLink className="w-full">
                                    <MenuItem label="Login" onClick={() => setIsOpen(false)} />
                                </LoginLink>
                                <LoginLink className="w-full">
                                    <MenuItem label="Sign up" onClick={() => setIsOpen(false)} />
                                </LoginLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;