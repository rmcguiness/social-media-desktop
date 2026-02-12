import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeButton } from "@/components";
import { UserMenu } from "./user-menu";
import { getAuthToken } from "@/app/actions/auth";

const NavBar = async () => {
    const token = await getAuthToken();
    const isLoggedIn = !!token;

    return (
        <nav className="z-50 h-16 bg-background-secondary backdrop-blur-md bg-opacity-80 dark:bg-opacity-90 flex gap-2 md:gap-4 justify-between items-center px-3 md:px-6 border-b border-border shadow-sm">
            {/* Logo and Title */}
            <Link href="/home" className="flex items-center gap-2 hover:opacity-90 transition-all duration-200 hover:scale-105">
                <Image 
                    src="/favicon.ico" 
                    alt="logo" 
                    className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" 
                    width={40} 
                    height={40} 
                />
                <h1 className="text-lg md:text-2xl font-bold text-nowrap hidden sm:block gradient-text drop-shadow-sm">
                    Social Media
                </h1>
            </Link>

            {/* Search Bar */}
            <div className="flex flex-1 max-w-sm md:max-w-lg items-center gap-2 rounded-full bg-background border border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent focus-within:ring-opacity-20 px-3 md:px-4 py-2 transition-all duration-200">
                <Search className="w-4 h-4 md:w-5 md:h-5 text-foreground-muted flex-shrink-0" />
                <input 
                    className="w-full text-sm md:text-base placeholder:text-foreground-muted outline-none bg-transparent" 
                    placeholder="Search..." 
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
                <ThemeButton />
                {!isLoggedIn && (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/login"
                            className="hidden sm:block px-3 md:px-4 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-3 md:px-4 py-2 text-sm font-semibold bg-accent text-white rounded-full hover:bg-accent-hover active:scale-95 transition-all duration-200 shadow-sm"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default NavBar;