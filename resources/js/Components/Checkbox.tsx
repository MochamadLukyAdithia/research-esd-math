import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                `rounded border-secondary/20 text-secondary shadow-sm focus:ring-secondary focus:ring-offset-background ` +
                className
            }
        />
    );
}
