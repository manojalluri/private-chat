import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { getOrCreateAnonId } from '../utils/anonId';

const CreateJoinRoom = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'join'
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [expiryType, setExpiryType] = useState('24h');
  const [anonId, setAnonId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Get or generate anonId
  React.useEffect(() => {
    const storedAnonId = getOrCreateAnonId();
    setAnonId(storedAnonId);
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.createRoom({
        roomName,
        expiryType
      });

      // Join the room after creation
      await apiService.joinRoom({
        roomCode: response.data.roomCode,
        anonId
      });

      navigate(`/room/${response.data.roomCode}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create room');
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.joinRoom({
        roomCode,
        anonId
      });

      // Check if room has expired
      const roomCheck = await apiService.checkRoomExpiry(roomCode);
      if (roomCheck.data.isExpired) {
        navigate(`/room/${roomCode}/expired`);
        return;
      }

      navigate(`/room/${roomCode}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to join room');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-anora-bg relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-anora-primary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-anora-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full z-20 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-anora-primary to-anora-accent rounded-xl flex items-center justify-center shadow-lg shadow-anora-primary/50">
            <span className="text-white font-display font-bold text-xl">A</span>
          </div>
          <h1 className="text-xl font-bold font-display tracking-wider text-white hidden sm:block">ANORA</h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-anora-text-dim hover:text-white transition-colors flex items-center space-x-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>Back to Home</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="glass p-1 rounded-3xl mb-8 flex relative">
          <div
            className={`absolute top-1 bottom-1 w-1/2 bg-anora-card rounded-2xl shadow-lg transition-all duration-300 ease-in-out ${activeTab === 'join' ? 'translate-x-full' : 'translate-x-0'}`}
          ></div>

          <button
            className={`flex-1 py-4 text-center font-display font-bold tracking-wide relative z-10 transition-colors duration-300 ${activeTab === 'create' ? 'text-white' : 'text-anora-text-dim hover:text-white'
              }`}
            onClick={() => setActiveTab('create')}
          >
            CREATE ROOM
          </button>
          <button
            className={`flex-1 py-4 text-center font-display font-bold tracking-wide relative z-10 transition-colors duration-300 ${activeTab === 'join' ? 'text-white' : 'text-anora-text-dim hover:text-white'
              }`}
            onClick={() => setActiveTab('join')}
          >
            JOIN ROOM
          </button>
        </div>

        <div className="glass p-8 rounded-3xl relative overflow-hidden backdrop-blur-xl">
          {/* Glow Effect */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-anora-primary to-transparent opacity-50"></div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white font-display mb-2">
              {activeTab === 'create' ? 'Initialize Secure Space' : 'Connect to Frequency'}
            </h2>
            <p className="text-anora-text-dim text-sm">
              {activeTab === 'create'
                ? 'Generate a new encrypted channel'
                : 'Enter access code to decrypt room'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {/* Create Room Form */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateRoom} className="space-y-6">
              <div>
                <label className="block text-anora-text text-sm font-medium mb-2 ml-1">
                  Room Designation
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-anora-primary to-anora-secondary rounded-xl opacity-20 group-hover:opacity-50 transition duration-300 blur"></div>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="relative w-full bg-anora-bg/80 border border-anora-border text-white px-4 py-3 rounded-xl focus:outline-none focus:border-anora-primary/50 focus:ring-1 focus:ring-anora-primary/50 transition-all placeholder-anora-text-dim/50"
                    placeholder="e.g. Project Alpha"
                    required
                    maxLength="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-anora-text text-sm font-medium mb-3 ml-1">
                  Self-Destruct Timer
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`py-3 px-4 rounded-xl border transition-all duration-200 ${expiryType === '24h'
                        ? 'border-anora-primary bg-anora-primary/10 text-anora-primary shadow-[0_0_15px_rgba(108,99,255,0.3)]'
                        : 'border-anora-border bg-anora-bg/50 text-anora-text-dim hover:border-anora-text-dim'
                      }`}
                    onClick={() => setExpiryType('24h')}
                  >
                    24 Hours
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-4 rounded-xl border transition-all duration-200 ${expiryType === '7d'
                        ? 'border-anora-primary bg-anora-primary/10 text-anora-primary shadow-[0_0_15px_rgba(108,99,255,0.3)]'
                        : 'border-anora-border bg-anora-bg/50 text-anora-text-dim hover:border-anora-text-dim'
                      }`}
                    onClick={() => setExpiryType('7d')}
                  >
                    7 Days
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden bg-anora-primary hover:bg-anora-primary/90 text-white py-4 px-4 rounded-xl font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-anora-primary/25"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    INITIALIZING...
                  </span>
                ) : 'CREATE ROOM'}
              </button>
            </form>
          )}

          {/* Join Room Form */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoinRoom} className="space-y-6">
              <div>
                <label className="block text-anora-text text-sm font-medium mb-2 ml-1">
                  Access Code
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-anora-secondary to-anora-primary rounded-xl opacity-20 group-hover:opacity-50 transition duration-300 blur"></div>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="relative w-full bg-anora-bg/80 border border-anora-border text-white text-center text-2xl tracking-[0.2em] font-display uppercase px-4 py-4 rounded-xl focus:outline-none focus:border-anora-secondary/50 focus:ring-1 focus:ring-anora-secondary/50 transition-all placeholder-anora-text-dim/30"
                    placeholder="XXXXXX"
                    required
                    maxLength="6"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden bg-anora-secondary hover:bg-anora-secondary/90 text-anora-bg py-4 px-4 rounded-xl font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-anora-secondary/25"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {loading ? 'CONNECTING...' : 'JOIN ROOM'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-anora-border text-center">
            <p className="text-xs text-anora-text-dim">
              By connecting, you agree to our anonymity protocol.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateJoinRoom;