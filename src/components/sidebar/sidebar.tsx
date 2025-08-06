'use client';
import { ArrowRight, X } from "lucide-react";
import { itemsList } from "./items-list";
import { useState } from "react";
import SidebarItem from "./sidebar-item";

const SideBar = () => {
    const [windowOpen, setWindowOpen] = useState(true);

    const handleWindowOpen = () => {
        setWindowOpen(!windowOpen);
    }

    return (
        <div className="flex flex-col sticky top-16 max-h-[var(--screen-minus-navbar)] w-min items-start gap-2 shadow-0-sm-glow p-4">
            <div className="w-full justify-end sm:flex hidden">
                {windowOpen ? (
                    <button onClick={handleWindowOpen}>
                        <X size={20} />
                    </button>
                ) : (
                    <button onClick={handleWindowOpen}>
                        <ArrowRight size={20} />
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {Object.values(itemsList).map((item) => (
                    <SidebarItem key={item.href} {...item} isActive={windowOpen} />
                ))}
            </div>
        </div>
    )
}

export default SideBar;