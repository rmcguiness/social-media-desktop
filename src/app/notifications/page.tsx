import { SideBar } from "@/components";

const Notifications = () => {
    return (
        <div className="font-sans min-h-screen flex gap-4">
            <SideBar />
            <main className="flex flex-col w-full ">
                <h1 className="text-2xl font-bold">Notifications</h1>
            </main>
        </div>
    )
}

export default Notifications;