import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-anora-bg text-anora-text relative overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-anora-primary opacity-20 rounded-full blur-[100px] animate-blob mix-blend-screen"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-anora-secondary opacity-20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-anora-accent opacity-20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-anora-primary to-anora-accent rounded-xl flex items-center justify-center shadow-lg shadow-anora-primary/50 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-display font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-wider text-white group-hover:text-anora-secondary transition-colors glow-text">ANORA</h1>
          </div>
          <nav>
            <Link to="/create-join" className="relative group px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all overflow-hidden">
              <span className="relative z-10 font-bold tracking-wide text-sm bg-clip-text text-transparent bg-gradient-to-r from-anora-secondary to-anora-accent group-hover:text-white transition-all">ENTER ROOM</span>
              <div className="absolute inset-0 bg-gradient-to-r from-anora-primary to-anora-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-4 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl text-center space-y-8">
          <div className="inline-block animate-fade-in">
            <span className="py-1 px-3 rounded-full bg-anora-primary/10 border border-anora-primary/30 text-anora-primary text-xs font-bold tracking-widest uppercase">V 1.0 Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold font-display leading-tight animate-slide-up">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-anora-text to-anora-text-dim">Absolute Privacy.</span>
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-anora-primary via-anora-secondary to-anora-accent glow-text">Zero Trace.</span>
          </h1>

          <p className="text-lg md:text-xl text-anora-text-dim max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            Communicate freely in ephemeral, encrypted rooms. No logins, no history, just pure connection.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-slide-up animation-delay-400">
            <Link
              to="/create-join"
              className="group relative px-8 py-4 bg-anora-primary rounded-xl overflow-hidden shadow-2xl shadow-anora-primary/40 hover:shadow-anora-primary/60 transition-all hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-anora-primary via-anora-accent to-anora-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
              <span className="relative z-10 font-bold text-white tracking-wide">START ANONYMOUS CHAT</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 px-4">
          <FeatureCard
            icon={
              <svg className="w-8 h-8 text-anora-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="End-to-End Privacy"
            desc="Your identity is never stored. Rooms vanish after use."
            delay="0"
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8 text-anora-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Instant Anon ID"
            desc="Generate a unique, temporary persona for every session."
            delay="100"
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8 text-anora-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Safe Zone"
            desc="Advanced moderation tools to keep your safe space safe."
            delay="200"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5 bg-anora-bg/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-anora-text-dim text-sm">© {new Date().getFullYear()} ANORA. Crafted for silence.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <div
    className="glass p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 group cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10 group-hover:ring-white/20">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 font-display">{title}</h3>
    <p className="text-anora-text-dim leading-relaxed group-hover:text-anora-text transition-colors">{desc}</p>
  </div>
);

export default LandingPage;