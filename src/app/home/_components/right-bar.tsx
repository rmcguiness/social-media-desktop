import { DropdownCard, Comment } from "@/components";
import { Post } from "@/types/post-type";

type RightBarProps = {
    comments: Post[];
};

const RightBar = ({ comments }: RightBarProps) => {
    return (
        <div className="hidden sm:flex flex-4/12 flex-col sticky h-min top-21 w-full md:w-100 gap-4">
            <DropdownCard title="Comments" className="max-h-[500px] overflow-y-auto">
                {comments?.length === 0 ? (
                    <p className="text-sm text-foreground-muted">No posts yet</p>
                ) : (
                    comments?.map((comment) => (
                        <Comment key={comment.id} post={comment} />
                    ))
                )}
            </DropdownCard>
            <DropdownCard title="Trending">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
            </DropdownCard>
            <DropdownCard title="Communities">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
            </DropdownCard>
        </div>
    );
};

export default RightBar;
