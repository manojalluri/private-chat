import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateJoinRoom from './pages/CreateJoinRoom';
import ChatRoom from './pages/ChatRoom';
import RoomExpired from './pages/RoomExpired';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-join" element={<CreateJoinRoom />} />
        <Route path="/room/:roomCode" element={<ChatRoom />} />
        <Route path="/room/:roomCode/expired" element={<RoomExpired />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  );
}

export default App;