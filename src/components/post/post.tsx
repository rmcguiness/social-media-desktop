import { Post as PostType } from '@/types/post-type';
import Image from 'next/image';
import ImageWrapper from '../next-image-wrapper/image-wrapper';
import Card from '../card/card';

const Post = ({ post }: { post: PostType }) => {
    return (
        <Card>
            <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                    <Image src={post.user.image} alt={post.user.name} width={32} height={32} className="rounded-full" />
                    <h1>{post.user.name}</h1>
                </div>
                <h1 className="text-lg font-bold">{post.title}</h1>
                <p>{post.content}</p>
                {post.image ? <ImageWrapper src={post.image} alt={post.title} imageClassName="rounded-lg" /> : null}
            </div>
        </Card>
    );
};

export default Post;