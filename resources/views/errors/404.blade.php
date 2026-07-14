@extends('errors.layout')

@section('title', '404 – Halaman Tidak Ditemukan')

@section('extra-styles')
<style>
    /* Floating math symbols decoration for 404 */
    .math-float {
        position: absolute;
        font-weight: 800;
        opacity: 0;
        animation: floatUp 6s ease-in-out infinite;
        pointer-events: none;
        color: var(--gold);
    }
    @keyframes floatUp {
        0%   { opacity: 0; transform: translateY(0) rotate(0deg); }
        20%  { opacity: .25; }
        80%  { opacity: .15; }
        100% { opacity: 0; transform: translateY(-120px) rotate(20deg); }
    }
    .float-wrap {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    }
</style>
@endsection

@section('content')
{{-- Floating math symbols --}}
<div class="float-wrap" aria-hidden="true">
    <span class="math-float" style="left:10%;bottom:30%;font-size:28px;animation-delay:0s">π</span>
    <span class="math-float" style="left:25%;bottom:20%;font-size:22px;animation-delay:1.2s">∑</span>
    <span class="math-float" style="left:45%;bottom:25%;font-size:32px;animation-delay:2.5s">√</span>
    <span class="math-float" style="left:65%;bottom:15%;font-size:24px;animation-delay:.8s">∞</span>
    <span class="math-float" style="left:80%;bottom:35%;font-size:20px;animation-delay:1.8s">∫</span>
    <span class="math-float" style="left:90%;bottom:22%;font-size:26px;animation-delay:3s">Δ</span>
</div>

<!-- <div class="error-badge">
    <span class="dot"></span>
    ERROR 404
</div> -->

<div class="error-code" data-code="404">404</div>

<div class="error-icon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="7" stroke="#F5C518" stroke-width="1.8"/>
        <path d="M16.5 16.5L21 21" stroke="#F5C518" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M8.5 11h5M11 8.5v5" stroke="#F5C518" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
</div>

<h1 class="error-title">Halaman Tidak Ditemukan</h1>

<p class="error-desc">
    Sepertinya halaman yang kamu cari sudah pindah, dihapus, atau mungkin
    alamat URL-nya salah. Coba periksa kembali URL atau mulai dari beranda.
</p>

<div class="actions">
    <a href="/" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Kembali ke Beranda
    </a>
    <a href="{{ route('portal.index') ?? '/portal' }}" class="btn-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        Jelajahi Portal
    </a>
</div>
@endsection