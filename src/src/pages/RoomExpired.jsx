import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RoomExpired = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-anora-bg flex flex-col relative overflow-hidden items-center justify-center">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>

      <header className="absolute top-0 w-full z-20 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-anora-primary to-anora-accent rounded-xl flex items-center justify-center shadow-lg shadow-anora-primary/50">
            <span className="text-white font-display font-bold text-xl">A</span>
          </div>
          <h1 className="text-xl font-bold font-display tracking-wider text-white hidden sm:block">ANORA</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md relative z-10 px-4 animate-slide-up">
        <div className="glass p-8 rounded-3xl text-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/30">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white font-display mb-4">Signal Lost</h2>
          <p className="text-anora-text-dim mb-2">
            The frequency <span className="font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-red-400">{roomCode}</span> has decayed.
          </p>
          <p className="text-anora-text-dim/70 text-sm mb-8 leading-relaxed">
            As per protocol, all data traces within this room have been permanently incinerated for your security.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/create-join')}
              className="w-full bg-red-500 text-white py-4 px-4 rounded-xl font-bold tracking-wide hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
              ESTABLISH NEW SIGNAL
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-transparent border border-white/10 text-anora-text-dim py-4 px-4 rounded-xl font-bold hover:bg-white/5 hover:text-white transition-all"
            >
              RETURN TO BASE
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomExpired;