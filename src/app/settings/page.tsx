import { PageTitle } from "@/components";

const Settings = () => {
    return (
        <div className="font-sans min-h-[var(--screen-minus-navbar)] w-full flex gap-4">
            <main className="flex flex-col w-full max-w-3xl px-5 mx-auto justify-self-center">
                <PageTitle title="Settings" />
            </main>
        </div>
    )
}

export default Settings;