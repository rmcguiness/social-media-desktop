import { Post as PostType } from '@/types/post-type';
import Image from 'next/image';
import { ImageWrapper, Card } from '@/components';
import { Heart, MessageCircle, Share } from 'lucide-react';

const Post = ({ post }: { post: PostType }) => {
    return (
        <Card>
            <div className="flex flex-col m-4 gap-2">
                <div className="flex items-start gap-2">
                    <Image src={post.user.image} alt={post.user.name} width={32} height={32} className="rounded-full" />
                    <h1>{post.user.name}</h1>
                </div>
                <div>
                    <h1 className="text-lg font-bold">{post.title}</h1>
                    <p>{post.content}</p>
                    {post.image ? <ImageWrapper src={post.image} alt={post.title} imageClassName="rounded-lg" /> : null}
                </div>
                <div className="flex w-full justify-end items-center pt-1 px-2 sm:gap-5 gap-2">
                    <button className="flex items-center gap-1">
                        <Share size={18} />
                        <span>{post.shares}</span>
                    </button>
                    <button className="flex items-center gap-1">
                        <MessageCircle size={18} />
                        <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1">
                        <Heart size={18} />
                        <span>{post.likes}</span>
                    </button>
                </div>

            </div>
        </Card>
    );
};

export default Post;