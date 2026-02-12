import cn from 'classnames';
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <div className={cn(`card border border-border bg-background-secondary`, className)}>
        {children}
    </div>;
};

export default Card;