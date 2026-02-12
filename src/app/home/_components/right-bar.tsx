import { DropdownCard } from "@/components";

const RightBar = () => {
    return (
        <div className="flex flex-col sticky top-20 h-fit gap-4">
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
