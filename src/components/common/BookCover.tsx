type BookCoverProps = {
    src: string;
    alt: string;
    className?: string;
};

export default function BookCover({ src, alt, className = "",}: BookCoverProps) {
    return (
        <img src={src} alt={alt} className={`w-full rounded-xl object-cover ${className}`} />
    );
}