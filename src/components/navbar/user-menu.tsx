'use client';

import { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:shadow-md-glow transition-all duration-300"
            >
                <User size={20} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close menu */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-foreground-muted rounded-md shadow-lg z-20">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
