import Image from "next/image";
import s from './image-wrapper.module.css';
import cn from "classnames";

const ImageWrapper = ({ src, alt, wrapperClassName, imageClassName }: { src: string; alt: string; wrapperClassName?: string, imageClassName?: string }) => {
    return (
        <div className={cn(s['wrapper'], wrapperClassName)}>
            <Image
                src={src}
                alt={alt}
                className={cn(s['image'], imageClassName)}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                style={{ objectFit: 'cover' }}
                placeholder="empty"
            />
        </div>
    );
};

export default ImageWrapper;