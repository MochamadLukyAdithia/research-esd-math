import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/assets/logo.png"
            alt="ESD MathPath"
            className={`${props.className ?? ''} object-contain`}
        />
    );
}
