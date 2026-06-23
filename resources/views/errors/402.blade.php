@extends('errors.layout')

@section('title', '402 – Pembayaran Diperlukan')

@section('content')
<!-- <div class="error-badge">
    <span class="dot"></span>
    ERROR 402
</div> -->

<div class="error-code" data-code="402">402</div>

<div class="error-icon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#F5C518" stroke-width="1.8"/>
        <path d="M2 10h20" stroke="#F5C518" stroke-width="1.8"/>
        <circle cx="7" cy="15" r="1.5" fill="#F5C518"/>
        <rect x="10" y="13.5" width="7" height="3" rx="1" fill="rgba(245,197,24,0.3)" stroke="#F5C518" stroke-width="1"/>
    </svg>
</div>

<h1 class="error-title">Konten Premium</h1>

<p class="error-desc">
    Fitur atau materi ini tersedia khusus untuk anggota premium ESD MathPath.
    Tingkatkan paketmu untuk mengakses seluruh jalur belajar dan konten eksklusif.
</p>

<div class="actions">
    <a href="{{ route('upgrade') ?? '/premium' }}" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        Lihat Paket Premium
    </a>
    <a href="/" class="btn-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Kembali ke Beranda
    </a>
</div>
@endsection