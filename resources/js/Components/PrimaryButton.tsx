import { ButtonHTMLAttributes } from "react";

const SpinnerIcon = () => (
    <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

export default function PrimaryButton({
    className = "",
    disabled,
    processing,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { processing?: boolean }) {
    return (
        <button
            {...props}
            className={`w-full flex justify-center items-center bg-secondary-light hover:bg-blue-700 text-white font-semibold p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ${className}`}
            disabled={disabled || processing}
        >
            {processing ? (
                <>
                    <SpinnerIcon /> Memproses...
                </>
            ) : (
                children
            )}
        </button>
    );
}
