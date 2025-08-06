import { Bell, House } from "lucide-react";

const SideBar = () => {
    return (
        <div className="flex flex-col w-min items-start gap-4 border-r border-gray-200 p-4">
            <div className="flex items-center gap-2">
                <House size={20} />
                <h5 className="text-md font-bold sm:block hidden ">Home</h5>
            </div>
            <div className="flex items-center gap-2">
                <Bell size={20} />
                <h5 className="text-md font-bold sm:block hidden">Notifications</h5>
            </div>
        </div>
    )
}

export default SideBar;