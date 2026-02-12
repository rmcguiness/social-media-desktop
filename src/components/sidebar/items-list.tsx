import { Bell, House, MessageCircle, Settings, User } from "lucide-react";

export const itemsList = {
    home: {
        icon: <House size={20} />,
        href: "/home",
        label: "Home",
    },
    notifications: {
        icon: <Bell size={20} />,
        href: "/notifications",
        label: "Notifications",
    },
    messages: {
        icon: <MessageCircle size={20} />,
        href: "/messages",
        label: "Messages",
    },
    profile: {
        icon: <User size={20} />,
        href: "/profile",
        label: "Profile",
    },
    settings: {
        icon: <Settings size={20} />,
        href: "/settings",
        label: "Settings",
    },
}
