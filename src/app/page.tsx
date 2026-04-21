'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const roles = ['Techie', 'Sales-Hero', 'Nerd', 'Finanznerd', 'Head of Spaß', 'CMO', 'CTO', 'Visionär']

export default function LandingPage() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % roles.length)
        setVisible(true)
      }, 400)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <main style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif" }} className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=DM+Serif+Display:ital@0;1&display=swap');
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
        .rotating-word {
          display: inline-block;
          color: #fff;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 2px 18px;
          transition: opacity 0.35s ease, transform 0.35s ease;
          font-style: italic;
        }
        .rotating-word.hidden {
          opacity: 0;
          transform: translateY(10px);
        }
        .rotating-word.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .city-dot {
          cursor: default;
        }
        .city-dot:hover circle { r: 7; }
        .partner-logo {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          min-width: 120px;
          color: rgba(255,255,255,0.2);
          font-size: 13px;
          letter-spacing: 0.05em;
          transition: border-color 0.2s;
        }
        .partner-logo:hover { border-color: rgba(255,255,255,0.2); }
      `}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <span className="hero-title text-xl tracking-tight">BYmate</span>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="cta-btn-outline" style={{padding: '10px 24px', fontSize: '14px'}}>Einloggen</Link>
          <Link href="/auth" className="cta-btn" style={{padding: '10px 24px', fontSize: '14px'}}>Registrieren</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center px-6 pt-24 pb-32 max-w-4xl mx-auto">
        <div className="tag">🥨 Nur für Bayern</div>
        <h1 className="hero-title text-5xl md:text-6xl leading-tight mb-6" style={{letterSpacing: '-0.02em'}}>
          Finde deinen neuen<br />
          <span
            className={`rotating-word ${visible ? 'visible' : 'hidden'}`}
          >
            {roles[index]}
          </span>
          <br />
          fürs Team.
        </h1>
        <p className="text-lg mb-10" style={{color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto 40px', lineHeight: '1.6'}}>
          BYmate verbindet Gründer mit freiem Teamplatz und Talente, die beim Aufbau eines Startups dabei sein wollen. Bayern-weit.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth" className="cta-btn">Jetzt mitmachen</Link>
          <Link href="#wie" className="cta-btn-outline">Wie es funktioniert</Link>
        </div>
      </section>

      {/* Bayern Karte */}
      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <p style={{color: 'rgba(255,255,255,0.2)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '24px', textTransform: 'uppercase'}}>Dein Netzwerk in Bayern</p>
        <div className="card" style={{padding: '40px', display: 'flex', justifyContent: 'center'}}>
          <svg viewBox="0 0 400 380" width="100%" style={{maxWidth: '420px'}} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bayern Umriss vereinfacht */}
            <path
              d="M80,40 L100,20 L140,15 L180,10 L220,15 L260,20 L300,30 L330,50 L350,80 L360,110 L365,140 L360,170 L350,200 L340,230 L320,260 L300,280 L280,300 L260,320 L240,340 L220,355 L200,365 L180,355 L160,340 L140,320 L120,300 L100,275 L80,250 L60,220 L50,190 L45,160 L50,130 L60,100 L70,70 Z"
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
            />
            {/* Städte */}
            {[
              { name: 'München', x: 210, y: 290, color: '#60a5fa', size: 8 },
              { name: 'Nürnberg', x: 220, y: 150, color: '#34d399', size: 6 },
              { name: 'Augsburg', x: 160, y: 270, color: '#f472b6', size: 5 },
              { name: 'Regensburg', x: 270, y: 160, color: '#fb923c', size: 5 },
              { name: 'Würzburg', x: 130, y: 100, color: '#a78bfa', size: 5 },
              { name: 'Ingolstadt', x: 200, y: 210, color: '#facc15', size: 4 },
              { name: 'Fürth', x: 210, y: 145, color: '#34d399', size: 4 },
              { name: 'Erlangen', x: 225, y: 138, color: '#34d399', size: 3 },
              { name: 'Bayreuth', x: 260, y: 110, color: '#f472b6', size: 4 },
              { name: 'Passau', x: 320, y: 250, color: '#60a5fa', size: 4 },
              { name: 'Rosenheim', x: 255, y: 310, color: '#fb923c', size: 4 },
              { name: 'Kempten', x: 130, y: 330, color: '#a78bfa', size: 4 },
            ].map(city => (
              <g key={city.name} className="city-dot">
                <circle cx={city.x} cy={city.y} r={city.size + 6} fill="transparent" />
                <circle cx={city.x} cy={city.y} r={city.size} fill={city.color} opacity={0.85} style={{transition: 'r 0.2s'}} />
                <circle cx={city.x} cy={city.y} r={city.size + 3} fill={city.color} opacity={0.15} />
                <text x={city.x + city.size + 6} y={city.y + 4} fill="rgba(255,255,255,0.4)" fontSize="10">{city.name}</text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <p style={{color: 'rgba(255,255,255,0.2)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '24px', textTransform: 'uppercase'}}>Unsere Partner</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4', 'Partner 5'].map(p => (
            <div key={p} className="partner-logo">{p}</div>
          ))}
        </div>
      </section>

      {/* Wie es funktioniert */}
      <section id="wie" className="max-w-4xl mx-auto px-6 pb-24">
        <p className="tag" style={{marginBottom: '16px'}}>So funktioniert es</p>
        <h2 className="hero-title text-4xl md:text-5xl mb-16" style={{letterSpacing: '-0.02em'}}>Einfach. Direkt. Bayerisch.</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: '01', title: 'Profil anlegen', text: 'Registriere dich in einer Minute und leg fest ob du ein Team suchst oder einen Mitgründer.' },
            { n: '02', title: 'Anzeige schalten', text: 'Beschreibe dein Startup, welche Skills du suchst und was du bietest. Optional im Stealth Mode.' },
            { n: '03', title: 'Direkt verbinden', text: 'Schreib andere Gründer direkt auf der Plattform an, anonym wenn du willst.' },
          ].map(s => (
            <div key={s.n} className="card">
              <div className="badge" style={{background: 'rgba(255,255,255,0.05)'}}>{s.n}</div>
              <h3 className="text-lg font-medium mb-3">{s.title}</h3>
              <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6'}}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Für wen */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <div style={{fontSize: '32px', marginBottom: '20px'}}>🚀</div>
            <h3 className="text-xl font-medium mb-3">Ich gründe gerade</h3>
            <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6'}}>Du baust ein Startup auf und suchst einen Mitgründer? Schalte ein Gesuch und finde den richtigen Co-Founder in Bayern.</p>
          </div>
          <div className="card">
            <div style={{fontSize: '32px', marginBottom: '20px'}}>🤝</div>
            <h3 className="text-xl font-medium mb-3">Ich will dabei sein</h3>
            <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6'}}>Du willst ein Startup mitaufbauen, hast Skills und Bock aber noch kein eigenes Projekt? Zeig dich und lass Gründer auf dich zukommen.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        <div className="card text-center" style={{padding: '80px 40px'}}>
          <h2 className="hero-title text-4xl md:text-5xl mb-6" style={{letterSpacing: '-0.02em'}}>Bereit loszulegen?</h2>
          <p style={{color: 'rgba(255,255,255,0.4)', marginBottom: '40px', fontSize: '16px'}}>Kostenlos, sicher, nur für Bayern.</p>
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
