import { Post as PostType } from '@/types/post-type';
import Image from 'next/image';
import Link from 'next/link';
import { ImageWrapper, Card, PostActions } from '@/components';
import { Heart, MessageCircle, Share } from 'lucide-react';

type PostProps = {
    post: PostType;
    clickable?: boolean;
    currentUserId?: number;
};

const Post = ({ post, clickable = true, currentUserId }: PostProps) => {
    const content = (
        <div className="flex flex-col p-4 md:p-5 gap-3">
            {/* Post Header */}
            <div className="flex items-center gap-3">
                <Image 
                    src={post.user.image} 
                    alt={post.user.name} 
                    width={40} 
                    height={40} 
                    className="rounded-full ring-2 ring-border"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold text-foreground hover:text-accent transition-colors">
                        {post.user.name}
                    </h3>
                    <p className="text-xs text-foreground-muted">@{post.user.username}</p>
                </div>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
                <h2 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                    {post.title}
                </h2>
                <p className="text-foreground-muted text-sm md:text-base leading-relaxed">
                    {post.content}
                </p>
                {post.image && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                        <ImageWrapper 
                            src={post.image} 
                            alt={post.title} 
                            imageClassName="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" 
                        />
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background text-foreground-muted hover:text-red-500 transition-colors group">
                    <Heart size={18} className="group-hover:fill-red-500" />
                    <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background text-foreground-muted hover:text-accent transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background text-foreground-muted hover:text-accent transition-colors">
                    <Share size={18} />
                    <span className="text-sm font-medium">{post.shares}</span>
                </button>
            </div>
            
            {/* Show edit/delete actions if not clickable (on post detail page) and user owns post */}
            {!clickable && <PostActions post={post} currentUserId={currentUserId} />}
        </div>
    );

    return (
        <Card className={clickable ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200" : ""}>
            {clickable ? (
                <Link href={`/posts/${post.id}`} className="block">
                    {content}
                </Link>
            ) : (
                content
            )}
        </Card>
    );
};

export default Post;