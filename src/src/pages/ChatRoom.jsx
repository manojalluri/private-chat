import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connectSocket, on, off, emit } from '../services/socketService';
import apiService from '../services/apiService';

const ChatRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [anonId] = useState(localStorage.getItem('anonId') || '');
  const [roomInfo, setRoomInfo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Connect to socket and join room
  useEffect(() => {
    if (!anonId) {
      navigate('/create-join');
      return;
    }

    const newSocket = connectSocket();
    setSocket(newSocket);

    // Join room
    emit('join-room', { roomCode, anonId });

    // Listen for events
    on('joined-room', (data) => {
      setRoomInfo(data);
      setIsLoading(false);
    });

    on('recent-messages', (data) => {
      setMessages(data);
    });

    on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    on('message-edited', (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data._id ? { ...msg, content: data.content, updatedAt: data.updatedAt } : msg
        )
      );
      setEditingMessage(null);
      setEditingContent('');
    });

    on('message-deleted', (data) => {
      setMessages(prev => prev.filter(msg => msg._id !== data._id));
    });

    on('message-hidden', (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data._id ? { ...msg, hidden: true } : msg
        )
      );
    });

    on('room-expired', () => {
      navigate(`/room/${roomCode}/expired`);
    });

    on('user-banned', (data) => {
      setError(data.message || 'You have been banned from this room');
    });

    on('error', (data) => {
      setError(data.message || 'An error occurred');
    });

    return () => {
      // Disconnect handlers but keep socket alive
      off('joined-room');
      off('recent-messages');
      off('new-message');
      off('message-edited');
      off('message-deleted');
      off('message-hidden');
      off('room-expired');
      off('user-banned');
      off('error');
    };
  }, [roomCode, anonId, navigate]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    emit('send-message', {
      roomCode,
      anonId,
      content: newMessage.trim()
    });

    setNewMessage('');
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message._id);
    setEditingContent(message.content);
  };

  const handleSaveEdit = () => {
    if (!editingContent.trim() || !socket) return;

    emit('edit-message', {
      messageId: editingMessage,
      content: editingContent.trim(),
      anonId
    });
  };

  const handleDeleteMessage = (messageId) => {
    if (!socket) return;

    emit('delete-message', {
      messageId,
      anonId
    });
  };

  const handleReportMessage = (messageId) => {
    if (!socket) return;

    emit('report-message', {
      messageId,
      anonId
    });
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditingContent('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-anora-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anora-primary mx-auto mb-4 shadow-[0_0_15px_rgba(108,99,255,0.3)]"></div>
          <p className="text-anora-text-dim font-display tracking-widest text-sm animate-pulse">ESTABLISHING CONNECTION...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-anora-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full glass rounded-3xl p-8 text-center border border-red-500/20">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-red-500/30">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white font-display mb-2">Connection Error</h3>
          <p className="text-anora-text-dim mb-6">{error}</p>
          <button
            onClick={() => navigate('/create-join')}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-bold tracking-wide hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
          >
            RETURN TO BASE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-anora-bg flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-anora-primary/10 rounded-full blur-[150px] animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="glass border-b border-white/5 shadow-lg z-20 py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-anora-text-dim hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white font-display tracking-wide glow-text">{roomInfo?.roomName}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-anora-secondary font-mono tracking-widest bg-anora-secondary/10 px-2 py-0.5 rounded border border-anora-secondary/20">{roomCode}</span>
                {roomInfo?.isVerified && (
                  <span className="bg-anora-primary/20 text-anora-primary border border-anora-primary/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(108,99,255,0.3)]">
                    SECURE
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-anora-text-dim text-xs hidden sm:inline-block">ENCRYPTED CONNECTION</span>
            <div className="w-9 h-9 bg-gradient-to-br from-anora-primary to-anora-accent rounded-full flex items-center justify-center shadow-lg shadow-anora-primary/30 ring-2 ring-white/10">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full p-4 md:p-6 relative z-10 h-[calc(100vh-80px)]">
        <div className="flex-grow glass rounded-3xl p-6 mb-4 overflow-y-auto custom-scrollbar flex flex-col relative">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-anora-primary/10 rounded-full flex items-center justify-center animate-pulse border border-anora-primary/20">
                <svg className="w-10 h-10 text-anora-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">Channel Opened</h3>
                <p className="text-anora-text-dim mt-1">Silence is golden, but connection is silver. Start transmitting.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.anonId === anonId ? 'justify-end' : 'justify-start'} group`}
                >
                  {message.hidden ? (
                    <div className="bg-white/5 border border-white/10 text-anora-text-dim px-4 py-2 rounded-xl text-sm italic backdrop-blur-sm">
                      [Data purged due to reports]
                    </div>
                  ) : (
                    <div className={`max-w-[85%] md:max-w-[70%] ${message.anonId === anonId ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-5 py-3 shadow-lg backdrop-blur-md relative ${message.anonId === anonId
                          ? 'bg-gradient-to-br from-anora-primary to-anora-primary/80 text-white rounded-2xl rounded-br-sm border border-anora-primary/50'
                          : 'bg-anora-card/80 text-anora-text rounded-2xl rounded-bl-sm border border-white/10'
                          }`}
                      >
                        {/* Glow for own messages */}
                        {message.anonId === anonId && (
                          <div className="absolute inset-0 bg-white/10 rounded-2xl rounded-br-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        )}
                        <p className="text-[15px] leading-relaxed break-words">{message.content}</p>
                      </div>
                      <div className={`flex items-center mt-1.5 text-[10px] uppercase font-bold tracking-wider text-anora-text-dim/70 ${message.anonId === anonId ? 'justify-end' : 'justify-start'}`}>
                        <span>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.anonId === anonId && (
                          <div className="ml-3 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => handleEditMessage(message)}
                              className="hover:text-anora-secondary transition-colors"
                              title="Edit Transmission"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(message._id)}
                              className="hover:text-anora-accent transition-colors"
                              title="Delete Transmission"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                        {message.anonId !== anonId && (
                          <button
                            onClick={() => handleReportMessage(message._id)}
                            className="ml-3 hover:text-anora-accent transition-colors opacity-0 group-hover:opacity-100 duration-200"
                            title="Report Signal"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        {editingMessage ? (
          <div className="glass rounded-2xl p-4 border border-anora-primary/30 shadow-[0_0_20px_rgba(108,99,255,0.1)]">
            <div className="flex flex-col space-y-3">
              <div className="text-xs text-anora-primary font-bold uppercase tracking-wider mb-1">Editing Transmission...</div>
              <textarea
                ref={inputRef}
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full bg-anora-bg/50 text-white px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:border-anora-primary/50 focus:ring-1 focus:ring-anora-primary/50 resize-none transition-all"
                rows="2"
                placeholder="Modify your signal..."
                maxLength="1000"
              />
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-lg text-anora-text-dim text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-anora-primary text-white px-6 py-2 rounded-lg font-bold text-sm tracking-wide shadow-lg shadow-anora-primary/20 hover:bg-anora-primary/90 transition-all"
                >
                  UPDATE
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="glass rounded-2xl p-2 md:p-3 flex items-center gap-3 border border-white/10 z-20">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow bg-anora-bg/40 text-white placeholder-anora-text-dim/50 px-5 py-3.5 rounded-xl border border-transparent focus:border-anora-primary/30 focus:bg-anora-bg/60 focus:outline-none transition-all"
              placeholder="Broadcast your message..."
              maxLength="1000"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-anora-primary to-anora-accent text-white p-3.5 rounded-xl shadow-lg shadow-anora-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none bg-size-200 bg-pos-0 hover:bg-pos-100"
            >
              <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default ChatRoom;