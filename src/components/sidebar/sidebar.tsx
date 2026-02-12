'use client';
import { Menu, X } from "lucide-react";
import { itemsList } from "./items-list";
import { useState, useEffect } from "react";
import SidebarItem from "./sidebar-item";

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-20 left-4 z-40 p-2 rounded-full bg-background-secondary border border-border shadow-lg md:hidden hover:bg-background active:scale-95 transition-all"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            )}

            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 md:top-16 left-0 z-40
                    h-screen md:h-[calc(100vh-4rem)]
                    bg-background-secondary border-r border-border
                    transition-all duration-300 ease-in-out
                    ${isMobile 
                        ? isOpen ? 'translate-x-0 w-64 mt-16' : '-translate-x-full w-0'
                        : isOpen ? 'w-64' : 'w-20'
                    }
                `}
            >
                <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
                    {/* Toggle Button (Desktop) */}
                    <div className="hidden md:flex justify-end p-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-background rounded-lg transition-colors"
                            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex flex-col gap-1 p-2">
                        {Object.values(itemsList).map((item) => (
                            <SidebarItem 
                                key={item.href} 
                                {...item} 
                                isActive={isOpen}
                                onClick={isMobile ? toggleSidebar : undefined}
                            />
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}

export default SideBar;