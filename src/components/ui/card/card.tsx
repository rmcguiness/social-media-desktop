import cn from 'classnames';
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <div className={cn(`bg-background rounded-lg shadow-sm-glow hover:shadow-0-md-glow transition-all duration-200`, className ? `${className}` : '')}>
        {children}
    </div>;
};

export default Card;