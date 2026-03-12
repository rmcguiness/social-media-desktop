export function PostFeedSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="card p-4 md:p-5 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-foreground/10" />
                        <div className="flex flex-col gap-1">
                            <div className="w-24 h-4 rounded bg-foreground/10" />
                            <div className="w-16 h-3 rounded bg-foreground/10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="w-3/4 h-5 rounded bg-foreground/10" />
                        <div className="w-full h-4 rounded bg-foreground/10" />
                        <div className="w-2/3 h-4 rounded bg-foreground/10" />
                    </div>
                    <div className="flex gap-4 mt-4 pt-2 border-t border-border">
                        <div className="w-16 h-8 rounded bg-foreground/10" />
                        <div className="w-16 h-8 rounded bg-foreground/10" />
                        <div className="w-16 h-8 rounded bg-foreground/10" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CreatePostSkeleton() {
    return (
        <div className="card mb-6 animate-pulse">
            <div className="p-4 md:p-5">
                <div className="w-full h-12 rounded-lg bg-foreground/10" />
            </div>
        </div>
    );
}

export function CommentsListSkeleton() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-foreground/10 flex-shrink-0" />
                    <div className="flex-1">
                        <div className="bg-background rounded-lg px-4 py-3">
                            <div className="w-20 h-4 rounded bg-foreground/10 mb-2" />
                            <div className="w-full h-3 rounded bg-foreground/10" />
                            <div className="w-2/3 h-3 rounded bg-foreground/10 mt-1" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function EditProfileFormSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="w-full h-32 rounded-lg bg-foreground/10" />
            <div className="space-y-2">
                <div className="w-24 h-4 rounded bg-foreground/10" />
                <div className="w-full h-10 rounded-lg bg-foreground/10" />
            </div>
            <div className="space-y-2">
                <div className="w-20 h-4 rounded bg-foreground/10" />
                <div className="w-full h-10 rounded-lg bg-foreground/10" />
            </div>
            <div className="w-full h-12 rounded-lg bg-foreground/10" />
        </div>
    );
}
