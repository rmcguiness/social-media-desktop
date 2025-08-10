import { Post } from "@/types/post-type";
import Image from "next/image";

const Comment = ({ post }: { post: Post }) => {
    const { content, user } = post;
    return (
        <div className="flex gap-2">
            <div className="flex flex-shrink-0 items-center justify-center">
                <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full" />
            </div>
            <div className="flex flex-col text-left">
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-sm">{content.slice(0, 50)}... <span className="text-foreground-muted">See more</span></p>
            </div>
        </div>
    )
}

export default Comment;