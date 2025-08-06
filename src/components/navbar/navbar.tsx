import { EllipsisVertical, Search } from "lucide-react";
import Image from "next/image";

const NavBar = () => {
    return (
        <div className="sticky top-0 dark:bg-background bg-white flex gap-4 justify-between items-center px-4 py-2 border-b border-gray-200 shadow-sm shadow-gray-200">
            <div className="flex items-center gap-2">
                <Image src="/favicon.ico" alt="logo" width={32} height={32} />
                <h1 className="text-2xl font-bold text-nowrap sm:block hidden">Social Media</h1>
            </div>
            <div className="flex flex-1 max-w-xl items-center gap-2 rounded-full border border-gray-300 p-2">
                <Search />
                <input className="w-full" placeholder="Search" />
            </div>
            <div>
                <EllipsisVertical />
            </div>
        </div>
    )
}

export default NavBar;