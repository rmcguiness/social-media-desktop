import { DropdownCard, Comment } from "@/components";
import { mockPosts } from "@/mocks/mockPosts";

const RightBar = () => {
    return (
        <div className="hidden sticky h-min top-21 md:flex flex-1 flex-col w-100 max-w-md mx-5 gap-4 ">
            <DropdownCard title="Comments" className="max-h-[500px] overflow-y-auto">
                {mockPosts.map((post) => (
                    <Comment key={post.id} post={post} />
                ))}
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
    )
}

export default RightBar;