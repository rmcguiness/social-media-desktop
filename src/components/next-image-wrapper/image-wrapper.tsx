import Image from "next/image";
import s from './image-wrapper.module.css';

const ImageWrapper = ({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className?: string }) => {
    const WrapperStyle = {
        position: 'relative' as const,
        maxWidth: width,
        width: '100%',
        objectFit: 'contain' as const,
    }
    return (
        <div style={WrapperStyle} className={className}>
            <Image src={src} alt={alt} className={s['image']} fill style={{ objectFit: 'cover' }} />
        </div>
    );
};

export default ImageWrapper;