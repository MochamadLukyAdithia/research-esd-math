@extends('errors.layout')

@section('title', '403 – Akses Dilarang')

@section('content')
<!-- <div class="error-badge">
    <span class="dot"></span>
    ERROR 403
</div> -->

<div class="error-code" data-code="403">403</div>

<div class="error-icon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#F5C518" stroke-width="1.8"/>
        <path d="M4.93 4.93l14.14 14.14" stroke="#F5C518" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
</div>

<h1 class="error-title">Akses Ditolak</h1>

<p class="error-desc">
    Kamu tidak memiliki izin untuk mengakses halaman ini.
    Jika kamu merasa ini adalah kesalahan, hubungi administrator atau coba masuk
    dengan akun yang memiliki akses yang sesuai.
</p>

<div class="actions">
    <a href="/" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Kembali ke Beranda
    </a>
    <a href="{{ route('login') }}" class="btn-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Masuk dengan Akun Lain
    </a>
</div>

@if ($exception->getMessage())
<p style="margin-top:32px;font-size:13px;color:#7B83A0;padding:12px 20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;max-width:420px;margin-left:auto;margin-right:auto;">
    {{ $exception->getMessage() }}
</p>
@endif
@endsection