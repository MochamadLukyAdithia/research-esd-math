@extends('errors.layout')

@section('title', '429 – Terlalu Banyak Permintaan')

@section('extra-styles')
<style>
    /* Countdown timer widget */
    .timer-card {
        margin: 0 auto 40px;
        padding: 20px 32px;
        background: rgba(245,197,24,.08);
        border: 1.5px solid rgba(245,197,24,.25);
        border-radius: 16px;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
    }
    .timer-label {
        font-size: 12px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--gray-500);
        font-weight: 600;
    }
    .timer-value {
        font-size: 48px;
        font-weight: 800;
        color: var(--gold);
        letter-spacing: -2px;
        line-height: 1;
        font-variant-numeric: tabular-nums;
    }
    .timer-sub {
        font-size: 13px;
        color: var(--gray-500);
    }
</style>
@endsection

@section('content')
<!-- <div class="error-badge">
    <span class="dot"></span>
    ERROR 429
</div> -->

<div class="error-code" data-code="429">429</div>

<div class="error-icon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#F5C518" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</div>

<h1 class="error-title">Terlalu Banyak Permintaan</h1>

<p class="error-desc">
    Kamu telah mengirim terlalu banyak permintaan dalam waktu singkat.
    Harap tunggu sebentar sebelum mencoba kembali.
</p>

<div class="timer-card" id="timerCard">
    <span class="timer-label">Coba lagi dalam</span>
    <span class="timer-value" id="countdown">60</span>
    <span class="timer-sub">detik</span>
</div>

<div class="actions">
    <a href="/" class="btn-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Kembali ke Beranda
    </a>
</div>

<script>
    (function() {
        let seconds = 60;
        const el = document.getElementById('countdown');
        const card = document.getElementById('timerCard');
        const iv = setInterval(() => {
            seconds--;
            el.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(iv);
                card.style.borderColor = 'rgba(245,197,24,.6)';
                el.textContent = '✓';
                document.querySelector('.actions').insertAdjacentHTML('beforebegin',
                    '<p style="margin-bottom:16px;font-size:14px;color:#F5C518;font-weight:600">Kamu sudah bisa mencoba kembali!</p>'
                );
            }
        }, 1000);
    })();
</script>
@endsection