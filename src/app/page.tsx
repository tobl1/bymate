import Link from 'next/link'

export default function LandingPage() {
  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#0a0a0a] text-white">
      
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        .hero-title { font-family: 'DM Serif Display', serif; }
        .tag { 
          display: inline-block;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 13px;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.5);
          margin-bottom: 32px;
        }
        .cta-btn {
          background: white;
          color: #0a0a0a;
          padding: 14px 32px;
          border-radius: 100px;
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.2s;
        }
        .cta-btn:hover { opacity: 0.85; }
        .cta-btn-outline {
          background: transparent;
          color: white;
          padding: 14px 32px;
          border-radius: 100px;
          font-weight: 400;
          font-size: 15px;
          text-decoration: none;
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.2);
          transition: border-color 0.2s;
        }
        .cta-btn-outline:hover { border-color: rgba(255,255,255,0.5); }
        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 40px;
          transition: border-color 0.2s;
        }
        .card:hover { border-color: rgba(255,255,255,0.15); }
        .divider {
          width: 1px;
          background: rgba(255,255,255,0.08);
          align-self: stretch;
        }
        .stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 48px;
          line-height: 1;
          margin-bottom: 8px;
        }
        .badge {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 18px;
        }
        .glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <span className="hero-title text-xl tracking-tight">BYmate</span>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="cta-btn-outline" style={{padding: '10px 24px', fontSize: '14px'}}>
            Einloggen
          </Link>
          <Link href="/auth" className="cta-btn" style={{padding: '10px 24px', fontSize: '14px'}}>
            Registrieren
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center px-6 pt-24 pb-32 max-w-4xl mx-auto overflow-hidden">
        <div className="glow" style={{top: '-200px', left: '50%', transform: 'translateX(-50%)'}} />
        <div className="tag">🥨 Nur für Bayern</div>
        <h1 className="hero-title text-6xl md:text-7xl leading-tight mb-6" style={{letterSpacing: '-0.02em'}}>
          Finde dein<br />
          <em>Gründerteam.</em>
        </h1>
        <p className="text-lg mb-10" style={{color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto 40px', lineHeight: '1.6'}}>
          BYmate verbindet Gründer mit freiem Teamplatz und Talente, die beim Aufbau eines Startups dabei sein wollen. Bayern-weit.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth" className="cta-btn">Jetzt mitmachen</Link>
          <Link href="#wie" className="cta-btn-outline">Wie es funktioniert</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="card flex flex-col md:flex-row items-center justify-around gap-8 md:gap-0" style={{padding: '48px'}}>
          <div className="text-center">
            <div className="stat-num">Bayern</div>
            <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px'}}>Dein Netzwerk</div>
          </div>
          <div className="divider hidden md:block" />
          <div className="text-center">
            <div className="stat-num">100%</div>
            <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px'}}>Kostenlos</div>
          </div>
          <div className="divider hidden md:block" />
          <div className="text-center">
            <div className="stat-num">0€</div>
            <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px'}}>Immer gratis</div>
          </div>
        </div>
      </section>

      {/* Wie es funktioniert */}
      <section id="wie" className="max-w-4xl mx-auto px-6 pb-24">
        <p className="tag" style={{marginBottom: '16px'}}>So funktioniert es</p>
        <h2 className="hero-title text-4xl md:text-5xl mb-16" style={{letterSpacing: '-0.02em'}}>
          Einfach. Direkt. Bayerisch.
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <div className="badge" style={{background: 'rgba(255,255,255,0.05)'}}>01</div>
            <h3 className="text-lg font-medium mb-3">Profil anlegen</h3>
            <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6'}}>
              Registriere dich in einer Minute und leg fest ob du ein Team suchst oder einen Mitgründer.
            </p>
          </div>
          <div className="card">
            <div className="badge" style={{background: 'rgba(255,255,255,0.05)'}}>02</div>
            <h3 className="text-lg font-medium mb-3">Anzeige schalten</h3>
            <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6'}}>
              Beschreibe dein Startup, welche Skills du suchst und was du bietest. Optional im Stealth Mode.
            </p>
          </div>
          <div className="card">
            <div className="badge" style={{background: 'rgba(255,255,255,0.05)'}}>03</div>
            <h3 className="text-lg font-medium mb-3">Direkt verbinden</h3>
            <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6'}}>
              Schreib andere Gründer direkt auf der Plattform an, anonym wenn du willst.
            </p>
          </div>
        </div>
      </section>

      {/* Für wen */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <div style={{fontSize: '32px', marginBottom: '20px'}}>🚀</div>
            <h3 className="text-xl font-medium mb-3">Ich gründe gerade</h3>
            <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6'}}>
              Du baust ein Startup auf und suchst einen Mitgründer mit einer bestimmten Expertise? Schalte ein Gesuch und finde den richtigen Co-Founder in Bayern.
            </p>
          </div>
          <div className="card">
            <div style={{fontSize: '32px', marginBottom: '20px'}}>🤝</div>
            <h3 className="text-xl font-medium mb-3">Ich will dabei sein</h3>
            <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6'}}>
              Du willst ein Startup mitaufbauen, hast Skills und Bock aber noch kein eigenes Projekt? Zeig dich und lass Gründer auf dich zukommen.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        <div className="card text-center" style={{padding: '80px 40px'}}>
          <h2 className="hero-title text-4xl md:text-5xl mb-6" style={{letterSpacing: '-0.02em'}}>
            Bereit loszulegen?
          </h2>
          <p style={{color: 'rgba(255,255,255,0.4)', marginBottom: '40px', fontSize: '16px'}}>
            Kostenlos, sicher, nur für Bayern.
          </p>
          <Link href="/auth" className="cta-btn">Jetzt registrieren</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t max-w-6xl mx-auto px-6 py-8 flex items-center justify-between" style={{borderColor: 'rgba(255,255,255,0.07)'}}>
        <span className="hero-title" style={{color: 'rgba(255,255,255,0.3)'}}>BYmate</span>
        <span style={{color: 'rgba(255,255,255,0.2)', fontSize: '13px'}}>© 2026 · Made in Bavaria</span>
      </footer>

    </main>
  )
}