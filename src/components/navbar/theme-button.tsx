'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeButton = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className='p-2 shadow-md-glow w-10 h-10 rounded-full animate-pulse transition-all duration-300' />
        );
    }

    const toggleTheme = () => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    };

    return (
        <button className="p-2 rounded-full hover:shadow-md-glow transition-all duration-300" onClick={toggleTheme}>
            {resolvedTheme === "light" ? <Sun /> : <Moon />}
        </button>
    );
};

export default ThemeButton;