import { EllipsisVertical, Search } from "lucide-react";
import Image from "next/image";
import { ThemeButton } from "@/components";

const NavBar = () => {
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
                <button className="p-2 rounded-full hover:shadow-md-glow transition-all duration-300">
                    <EllipsisVertical />
                </button>
            </div>
        </div>
    )
}

export default NavBar;