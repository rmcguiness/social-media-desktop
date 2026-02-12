import { PageTitle } from "@/components";
import { Filter } from "lucide-react";

export default function Loading() {
    return (
        <main className="font-sans flex gap-4 min-h-[var(--screen-minus-navbar)] mx-auto px-4 mb-10">
            <div className="flex flex-8/12 flex-col max-w-4xl">
                <PageTitle title="For You Page">
                    <button className="text-sm font-bold text-foreground-muted">
                        <Filter size={24} />
                    </button>
                </PageTitle>
                <div className="flex flex-col gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-foreground-muted/20 rounded-full" />
                                <div className="flex-1">
                                    <div className="h-4 bg-foreground-muted/20 rounded w-1/4 mb-2" />
                                    <div className="h-3 bg-foreground-muted/20 rounded w-1/6" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-foreground-muted/20 rounded w-3/4" />
                                <div className="h-4 bg-foreground-muted/20 rounded w-full" />
                                <div className="h-4 bg-foreground-muted/20 rounded w-5/6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="hidden sm:flex flex-4/12 flex-col sticky h-min top-21 w-full md:w-100 gap-4">
                <div className="bg-card rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-foreground-muted/20 rounded w-1/3 mb-4" />
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 bg-foreground-muted/20 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
