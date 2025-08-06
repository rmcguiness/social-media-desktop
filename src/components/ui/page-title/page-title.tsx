
const PageTitle = ({ title, children }: { title: string, children?: React.ReactNode }) => {
    return (
        <div className="flex flex-col gap-2 my-4">
            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold ">{title}</h1>
                {children ? children : null}
            </div>
            <hr className="w-full border-foreground-muted " />
        </div>
    )
}

export default PageTitle;