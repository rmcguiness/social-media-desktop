const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <div className={`bg-background rounded-lg p-4 shadow-sm-glow hover:shadow-0-md-glow transition-all duration-200 ${className}`}>{children}</div>;
};

export default Card;