const Card = ({ children }: { children: React.ReactNode }) => {
    return <div className="bg-background rounded-lg p-4 shadow-sm-glow hover:shadow-0-md-glow transition-all duration-200">{children}</div>;
};

export default Card;