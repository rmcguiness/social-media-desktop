'use client';
import { useRouter, usePathname } from "next/navigation";

interface SidebarItemProps {
    icon: React.ReactNode;
    href: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
}

const SidebarItem = ({ icon, href, label, isActive, onClick }: SidebarItemProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const isCurrentPage = pathname === href;

    const handleClick = () => {
        router.push(href);
        onClick?.();
    };

    return (
        <button
            onClick={handleClick}
            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 group relative overflow-hidden
                ${isCurrentPage 
                    ? 'bg-gradient-to-r from-accent to-accent-hover text-white font-semibold shadow-md' 
                    : 'hover:bg-background text-foreground hover:text-accent'
                }
                ${!isActive && 'justify-center'}
            `}
            style={isCurrentPage ? {
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            } : undefined}
        >
            <div className={`
                flex items-center justify-center
                ${isCurrentPage ? 'scale-110' : 'group-hover:scale-110'}
                transition-transform duration-200
            `}>
                {icon}
            </div>
            {isActive && (
                <span className="text-sm md:text-base font-medium whitespace-nowrap">
                    {label}
                </span>
            )}
        </button>
    );
}

export default SidebarItem;