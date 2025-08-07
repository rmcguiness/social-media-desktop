import cn from "classnames";

const PageTitle = ({ title, className, children }: { title: string, className?: string, children?: React.ReactNode }) => {
    return (
        <div className={cn("flex flex-col gap-2 mb-4 ", className)}>
            <div className="flex justify-between pt-4 items-center w-full">
                <h1 className="text-2xl font-bold ">{title}</h1>
                {children ? children : null}
            </div>
            <hr className="w-full border-foreground-muted " />
        </div>
    )
}

export default PageTitle;