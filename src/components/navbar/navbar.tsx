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
        <div className="sticky top-0 z-50 h-16 bg-background flex gap-4 justify-between items-center px-4 py-2 border-b border-gray-200 shadow-sm shadow-gray-200">
            <div className="flex items-center gap-2">
                <Image src="/favicon.ico" alt="logo" className="w-8 h-8" width={32} height={32} />
                <h1 className="text-2xl font-bold text-nowrap sm:block hidden">Social Media</h1>
            </div>
            <div className="flex flex-1 max-w-xl items-center gap-2 rounded-full border border-foreground-muted focus-within:border-foreground p-2 hover:shadow-0-md-glow transition-all duration-200">
                <Search />
                <input className="w-full placeholder:text-foreground-muted outline-none bg-transparent focus:outline-none" placeholder="Search" />
            </div>
            <div className="flex items-center gap-2">
                <ThemeButton />
                {isLoggedIn ? (
                    <UserMenu />
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-foreground hover:text-blue-500 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavBar;