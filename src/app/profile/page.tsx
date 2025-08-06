import { PageTitle } from "@/components";

const Profile = () => {
    return (
        <div className="font-sans min-h-[var(--screen-minus-navbar)] w-full flex gap-4">
            <main className="flex flex-col w-full mx-5 justify-self-center">
                <PageTitle title="Profile" />
            </main>
        </div>
    )
}

export default Profile;