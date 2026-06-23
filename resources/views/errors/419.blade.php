@extends('errors.layout')

@section('title', '419 – Sesi Kedaluwarsa')

@section('content')
<!-- <div class="error-badge">
    <span class="dot"></span>
    ERROR 419
</div> -->

<div class="error-code" data-code="419">419</div>

<div class="error-icon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#F5C518" stroke-width="1.8"/>
        <path d="M12 7v5l3 3" stroke="#F5C518" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 3.34A9 9 0 0 1 21 12" stroke="#F5C518" stroke-width="1.5" stroke-linecap="round" opacity=".4"/>
    </svg>
</div>

<h1 class="error-title">Sesi Halaman Kedaluwarsa</h1>

<p class="error-desc">
    Formulir yang kamu kirim sudah kedaluwarsa karena tidak ada aktivitas dalam beberapa waktu.
    Ini adalah langkah keamanan untuk melindungi akunmu. Muat ulang halaman dan coba lagi.
</p>

<div class="actions">
    <a href="javascript:history.back()" onclick="location.reload()" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.85"/></svg>
        Muat Ulang Halaman
    </a>
    <a href="/" class="btn-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Kembali ke Beranda
    </a>
</div>

<p style="margin-top:32px;font-size:13px;color:#7B83A0;">
    Tip: Jika masalah terus terjadi, coba hapus <em>cache</em> browser atau gunakan mode penyamaran.
</p>
@endsection