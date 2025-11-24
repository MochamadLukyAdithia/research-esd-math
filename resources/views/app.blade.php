<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ 'ESD MathPath' }}</title>

        <!-- Primary meta tags -->
        <meta name="title" content="ESD MathMap - Portal Pembelajaran Matematika Interaktif">
        <meta name="description" content="ESD MathMap — platform portal pembelajaran matematika interaktif, koleksi soal, dan peta tugas penelitian untuk pengajaran interaktif. Temukan soal, petunjuk, dan sumber daya yang mendukung pembelajaran matematika berbasis konteks ESD.">
        <meta name="keywords" content="Matematika, ESD, pendidikan, soal, pembelajaran, interaktif, peta tugas, portal">
        <meta name="author" content="ESD MathMap">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:title" content="ESD MathMap - Portal Pembelajaran Matematika Interaktif">
        <meta property="og:description" content="Platform pembelajaran matematika interaktif dengan koleksi soal dan peta tugas. Temukan sumber belajar yang mendukung ESD dan pengajaran kontekstual.">
        <meta property="og:image" content="{{ asset('assets/logo.png') }}">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="ESD MathMap - Portal Pembelajaran Matematika Interaktif">
        <meta name="twitter:description" content="Platform pembelajaran matematika interaktif dengan koleksi soal dan peta tugas untuk mendukung pengajaran ESD.">
        <meta name="twitter:image" content="{{ asset('assets/logo.png') }}">

        <!-- Canonical -->
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Favicon and icons -->
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/logo.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('assets/logo.png') }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('assets/logo.png') }}">
        <meta name="theme-color" content="#0ea5a4">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
