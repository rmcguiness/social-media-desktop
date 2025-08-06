import SideBar from "@/components/sidebar/sidebar";

export default function Home() {
    return (
        <div className="font-sans min-h-screen flex gap-4">
            <SideBar />
            <main className="flex flex-col w-full ">
                <h1 className="text-2xl font-bold">Home</h1>
            </main>
        </div>
    );
}