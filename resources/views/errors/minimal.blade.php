{{--
  minimal.blade.php
  Digunakan untuk error 500 & 503 — halaman ini TIDAK extend app layout
  karena app mungkin dalam keadaan rusak saat error server terjadi.
  Self-contained, zero external dependencies selain Google Fonts CDN.
--}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Server Error') – ESD MathPath</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
            --gold:#F5C518;--gold-dark:#D4A90E;
            --navy:#1B2A4A;--navy-mid:#243659;
            --white:#FFFFFF;--gray-300:#C4C9D8;--gray-500:#7B83A0;
        }
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:var(--navy);color:var(--white);overflow-x:hidden}
        body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(245,197,24,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(245,197,24,.05) 1px,transparent 1px);background-size:60px 60px;pointer-events:none;z-index:0}
        body::after{content:'';position:fixed;top:-20%;right:-10%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(245,197,24,.15) 0%,transparent 70%);pointer-events:none;z-index:0}
        nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:68px;background:rgba(27,42,74,.85);backdrop-filter:blur(12px);border-bottom:1px solid rgba(245,197,24,.15)}
        .nav-brand{display:flex;align-items:center;gap:10px;text-decoration:none}
        .nav-logo{width:36px;height:36px;background:var(--gold);border-radius:8px;display:flex;align-items:center;justify-content:center}
        .nav-brand-text{font-size:17px;font-weight:700;color:var(--white);letter-spacing:-.3px}
        .nav-brand-text span{color:var(--gold)}
        .page{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px 24px 60px;text-align:center}
        .error-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(245,197,24,.12);border:1px solid rgba(245,197,24,.3);border-radius:100px;font-size:12px;font-weight:700;color:var(--gold);letter-spacing:2px;text-transform:uppercase;margin-bottom:28px}
        .dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
        .error-code{font-size:clamp(100px,20vw,180px);font-weight:800;line-height:1;letter-spacing:-6px;background:linear-gradient(135deg,var(--white) 30%,var(--gold) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:20px}
        .error-icon{width:90px;height:90px;margin:0 auto 32px;border-radius:24px;background:rgba(245,197,24,.08);border:1.5px solid rgba(245,197,24,.2);display:flex;align-items:center;justify-content:center}
        .error-icon svg{width:44px;height:44px}
        .error-title{font-size:clamp(24px,4vw,36px);font-weight:700;color:var(--white);margin-bottom:16px;letter-spacing:-.5px}
        .error-desc{font-size:16px;line-height:1.7;color:var(--gray-300);max-width:480px;margin:0 auto 40px}
        .actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
        .btn-primary{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:var(--gold);color:var(--navy);border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;transition:all .2s;box-shadow:0 4px 20px rgba(245,197,24,.3)}
        .btn-primary:hover{background:var(--gold-dark);transform:translateY(-1px)}
        .btn-secondary{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:rgba(255,255,255,.06);color:var(--white);border:1.5px solid rgba(255,255,255,.15);border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;transition:all .2s}
        .btn-secondary:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.3)}
        .error-meta{margin-top:56px;display:flex;align-items:center;gap:16px;font-size:13px;color:var(--gray-500)}
        .error-meta a{color:var(--gray-300);text-decoration:none;transition:color .15s}
        .error-meta a:hover{color:var(--gold)}
        .meta-sep{width:4px;height:4px;border-radius:50%;background:var(--gray-500)}
        .math-deco{position:fixed;bottom:40px;left:50%;transform:translateX(-50%);display:flex;gap:28px;font-size:20px;color:rgba(245,197,24,.2);letter-spacing:4px;pointer-events:none;z-index:0}
        .glow-bottom{position:fixed;bottom:-15%;left:-5%;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(46,68,114,.6) 0%,transparent 70%);pointer-events:none;z-index:0}
        @media(max-width:600px){nav{padding:0 20px}.error-code{letter-spacing:-3px}}
    </style>
    @yield('extra-styles')
</head>
<body>
<div class="glow-bottom"></div>
<nav>
    <a href="/" class="nav-brand">
        <div class="nav-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 12H16M12 8V16" stroke="#1B2A4A" stroke-width="2.5" stroke-linecap="round"/></svg>
        </div>
        <span class="nav-brand-text">ESD <span>Math</span>Path</span>
    </a>
</nav>
<main class="page">
    @yield('content')
    <!-- <div class="error-meta">
        <span>ESD MathPath</span>
        <span class="meta-sep"></span>
        <a href="/bantuan">Bantuan</a>
        <span class="meta-sep"></span>
        <a href="/">Beranda</a>
    </div> -->
</main>
<div class="math-deco">π ∑ √ ∞ ÷ ×</div>
</body>
</html>