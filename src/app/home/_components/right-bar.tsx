import { DropdownCard, Comment } from "@/components";
import { mockPosts } from "@/mocks/mockPosts";

const RightBar = () => {
    return (
        <div className="hidden sm:flex flex-4/12  flex-col sticky h-min top-21 w-full md:w-100 gap-4 ">
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