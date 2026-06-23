@extends('errors.minimal')

@section('title', '503 – Sedang Dalam Pemeliharaan')

@section('extra-styles')
<style>
    /* Animated progress bar for maintenance */
    .maint-bar-wrap {
        width: 340px;
        max-width: 100%;
        margin: 0 auto 40px;
    }
    .maint-bar-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 13px;
        font-weight: 600;
        color: var(--gray-300);
    }
    .maint-bar {
        height: 6px;
        background: rgba(255,255,255,.08);
        border-radius: 100px;
        overflow: hidden;
    }
    .maint-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--gold) 0%, #fff5a0 100%);
        border-radius: 100px;
        width: 0%;
        animation: fillBar 2.5s ease forwards;
    }
    @keyframes fillBar { to { width: 72%; } }

    .maint-checklist {
        list-style: none;
        text-align: left;
        display: inline-flex;
        flex-direction: column;
        gap: 12px;
        margin: 0 auto 40px;
        max-width: 320px;
    }
    .maint-checklist li {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: var(--gray-300);
    }
    .maint-check-icon {
        width: 22px;
        height: 22px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .done   { background: rgba(72,199,142,.15); color: #48C78E; }
    .active { background: rgba(245,197,24,.15);  color: var(--gold);  }
    .todo   { background: rgba(255,255,255,.06); color: #7B83A0; }
</style>
@endsection

@section('content')
<!-- <div class="error-badge">
    <span class="dot"></span>
    PEMELIHARAAN
</div> -->

<div class="error-code" data-code="503">503</div>

<div class="error-icon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#F5C518" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</div>

<h1 class="error-title">Sedang Dalam Pemeliharaan</h1>

<p class="error-desc">
    ESD MathPath sedang dalam pemeliharaan terjadwal untuk meningkatkan
    pengalaman belajarmu. Kami akan kembali online secepatnya. Terima kasih atas kesabaranmu!
</p>

<div class="maint-bar-wrap">
    <div class="maint-bar-header">
        <span>Progress Pemeliharaan</span>
        <span style="color:var(--gold)">72%</span>
    </div>
    <div class="maint-bar"><div class="maint-bar-fill"></div></div>
</div>

<ul class="maint-checklist">
    <li>
        <span class="maint-check-icon done">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        Pembaruan Database
    </li>
    <li>
        <span class="maint-check-icon done">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        Optimasi Keamanan
    </li>
    <li>
        <span class="maint-check-icon active">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </span>
        Pembaruan Fitur 
    </li>
    <li>
        <span class="maint-check-icon todo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
        </span>
        Pengujian Akhir & Go Live
    </li>
</ul>

<div class="actions">
    <a href="javascript:location.reload()" class="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.85"/></svg>
        Coba Lagi
    </a>
</div>
@endsection