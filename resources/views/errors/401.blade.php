@extends('errors.layout')

@section('title', '401 – Akses Ditolak')

@section('content')
<!-- <div class="error-badge">
    <span class="dot"></span>
    ERROR 401
</div> -->

<div class="error-code" data-code="401">401</div>

<div class="error-icon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="#F5C518" stroke-width="1.8"/>
        <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="#F5C518" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="1.5" fill="#F5C518"/>
        <path d="M12 17.5v2" stroke="#F5C518" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
</div>

<h1 class="error-title">Autentikasi Diperlukan</h1>

<p class="error-desc">
    Halaman ini hanya dapat diakses setelah kamu masuk ke akun ESD MathPath.
    Silakan masuk terlebih dahulu untuk melanjutkan perjalanan belajarmu.
</p>

<div class="actions">
    <a href="{{ route('login') }}" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Masuk ke Akun
    </a>
    <a href="{{ route('register') }}" class="btn-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        Buat Akun Baru
    </a>
</div>
@endsection