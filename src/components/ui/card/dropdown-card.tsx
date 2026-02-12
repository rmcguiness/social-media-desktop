'use client';

import cn from 'classnames';
import { Card } from "@/components"
import { ChevronRight } from "lucide-react"
import { useState } from "react";


const DropdownCard = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <button onClick={() => setIsOpen(!isOpen)}>
            <Card className={className}>
                <div className={cn("flex justify-between sticky rounded-lg top-0 p-4 w-full  bg-background", isOpen ? 'rounded-b-none shadow-0-sm-glow' : '')}>
                    <h1 className="text-lg font-bold">{title}</h1>
                    <ChevronRight size={24} className={cn(isOpen ? 'rotate-z-90' : '', 'transition-all duration-300')} />
                </div>
                {isOpen
                    ?
                    <div className="p-4">
                        <div className="flex flex-col text-left gap-2">
                            {children}
                        </div>
                    </div>
                    :
                    null
                }
            </Card>
        </button>
    )
}

export default DropdownCard;