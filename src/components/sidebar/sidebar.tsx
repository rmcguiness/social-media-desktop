import { Bell, House } from "lucide-react";
import Link from "next/link";

const SideBar = () => {
    return (
        <div className="flex flex-col sticky top-16 max-h-[var(--screen-minus-navbar)] w-min items-start gap-4 shadow-0-sm-glow p-4">
            <div className="flex items-center gap-2">
                <House size={20} />
                <Link href="/home" className="text-md font-bold sm:block hidden ">Home</Link>
            </div>
            <div className="flex items-center gap-2">
                <Bell size={20} />
                <Link href="/notifications" className="text-md font-bold sm:block hidden">Notifications</Link>
            </div>
        </div>
    )
}

export default SideBar;