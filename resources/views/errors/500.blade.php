@extends('errors.minimal')

@section('title', '500 – Kesalahan Server')

@section('extra-styles')
<style>
    .status-steps {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 0 auto 40px;
        max-width: 480px;
    }
    .step-pill {
        padding: 8px 16px;
        border-radius: 100px;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .step-ok   { background: rgba(72,199,142,.12); color: #48C78E; border: 1px solid rgba(72,199,142,.25); }
    .step-err  { background: rgba(245,101,101,.12); color: #F56565; border: 1px solid rgba(245,101,101,.25); }
    .step-pend { background: rgba(255,255,255,.06);  color: #7B83A0;  border: 1px solid rgba(255,255,255,.1);  }
</style>
@endsection

@section('content')
<!-- <div class="error-badge">
    <span class="dot"></span>
    ERROR 500
</div> -->

<div class="error-code" data-code="500">500</div>

<div class="error-icon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 9v4M12 17h.01" stroke="#F5C518" stroke-width="2" stroke-linecap="round"/>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#F5C518" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</div>

<h1 class="error-title">Kesalahan pada Server</h1>

<p class="error-desc">
    Ada sesuatu yang tidak beres di sisi kami. Tim teknis ESD MathPath
    sudah mendapat notifikasi dan sedang menangani masalah ini secepat mungkin.
</p>

<div class="status-steps">
    <!-- <span class="step-pill step-ok">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Laporan Terkirim
    </span>
    <span class="step-pill step-err">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Server Error
    </span> -->
    <span class="step-pill step-pend">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Sedang Ditangani…
    </span>
</div>

<div class="actions">
    <a href="javascript:location.reload()" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.85"/></svg>
        Coba Lagi
    </a>
    <a href="/" class="btn-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Kembali ke Beranda
    </a>
</div>
@endsection