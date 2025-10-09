import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'background': '#FFFDF0',
                'primary': {
                    DEFAULT: '#F5C400',
                    light: '#FFDC5F',
                },
                'secondary': {
                    DEFAULT: '#001840',
                    light: '#102A71',
                },
        },
    },

    plugins: [forms],
},
};
