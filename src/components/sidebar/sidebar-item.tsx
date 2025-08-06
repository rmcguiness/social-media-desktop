import { useRouter } from "next/navigation";

const SidebarItem = ({ icon, href, label, isActive }: { icon: React.ReactNode, href: string, label: string, isActive: boolean }) => {
    const router = useRouter();
    return (
        <button onClick={() => {
            router.push(href);
        }} className="flex items-center gap-2 h-8">
            {icon}
            {isActive ? <div className="text-md font-bold sm:block hidden ">{label}</div> : null}
        </button>
    )
}

export default SidebarItem;