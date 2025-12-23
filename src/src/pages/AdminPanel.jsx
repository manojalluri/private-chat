import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AdminPanel = () => {
  const [adminSecret, setAdminSecret] = useState('');
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [anonId, setAnonId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('rooms');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load data
  useEffect(() => {
    if (adminSecret) {
      fetchRooms();
      fetchMessages();
    }
  }, [adminSecret]);

  const fetchRooms = async () => {
    try {
      const response = await apiService.getAllRooms(adminSecret);
      setRooms(response.data);
    } catch (err) {
      setError('Failed to fetch rooms: ' + (err.message || 'Network error'));
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await apiService.getAllMessages(adminSecret);
      setMessages(response.data);
    } catch (err) {
      setError('Failed to fetch messages: ' + (err.message || 'Network error'));
    }
  };

  const handleBanUser = async () => {
    if (!anonId) {
      setError('Anonymous ID is required');
      return;
    }

    try {
      await apiService.banUser({ anonId }, adminSecret);
      setSuccess('User banned successfully');
      setAnonId('');
      fetchRooms(); // Refresh data
    } catch (err) {
      setError('Failed to ban user: ' + (err.message || 'Network error'));
    }
  };

  const handleUnbanUser = async () => {
    if (!anonId) {
      setError('Anonymous ID is required');
      return;
    }

    try {
      await apiService.unbanUser({ anonId }, adminSecret);
      setSuccess('User unbanned successfully');
      setAnonId('');
      fetchRooms(); // Refresh data
    } catch (err) {
      setError('Failed to unban user: ' + (err.message || 'Network error'));
    }
  };

  const handleExpireRoom = async () => {
    if (!roomCode) {
      setError('Room code is required');
      return;
    }

    try {
      await apiService.expireRoom({ roomCode }, adminSecret);
      setSuccess('Room expired successfully');
      setRoomCode('');
      fetchRooms(); // Refresh data
    } catch (err) {
      setError('Failed to expire room: ' + (err.message || 'Network error'));
    }
  };

  const handleVerifyRoom = async () => {
    if (!roomCode) {
      setError('Room code is required');
      return;
    }

    try {
      await apiService.verifyRoom({ roomCode, isVerified }, adminSecret);
      setSuccess(`Room ${isVerified ? 'verified' : 'unverified'} successfully`);
      setRoomCode('');
      fetchRooms(); // Refresh data
    } catch (err) {
      setError('Failed to update room verification: ' + (err.message || 'Network error'));
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await apiService.deleteMessage(messageId, adminSecret);
      setSuccess('Message deleted successfully');
      fetchMessages(); // Refresh data
    } catch (err) {
      setError('Failed to delete message: ' + (err.message || 'Network error'));
    }
  };

  if (!adminSecret) {
    return (
      <div className="min-h-screen bg-anora-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-anora shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-anora-yellow bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-anora-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-anora-dark mb-2">Admin Panel</h2>
            <p className="text-anora-secondary">Enter admin secret to access</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-anora-dark font-medium mb-2">Admin Secret</label>
            <input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="w-full px-4 py-3 border border-anora-border rounded-anora focus:outline-none focus:ring-2 focus:ring-anora-yellow focus:border-transparent"
              placeholder="Enter admin secret"
            />
          </div>
          
          <button
            onClick={() => adminSecret && fetchRooms()}
            className="w-full bg-anora-yellow text-anora-dark py-3 px-4 rounded-anora font-medium hover:opacity-90 transition-opacity"
          >
            Access Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-anora-bg p-4">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white rounded-anora shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-anora-dark">Admin Panel</h1>
              <p className="text-anora-secondary">Manage rooms and monitor activity</p>
            </div>
            <button
              onClick={() => setAdminSecret('')}
              className="text-anora-secondary hover:text-anora-dark transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-anora mb-6">
            {error}
            <button 
              onClick={() => setError('')}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-anora mb-6">
            {success}
            <button 
              onClick={() => setSuccess('')}
              className="float-right text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-anora shadow-sm p-4">
            <h3 className="font-medium text-anora-dark mb-2">Ban User</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={anonId}
                onChange={(e) => setAnonId(e.target.value)}
                className="flex-grow px-3 py-2 border border-anora-border rounded-anora text-sm focus:outline-none focus:ring-2 focus:ring-anora-yellow focus:border-transparent"
                placeholder="Anonymous ID"
              />
              <button
                onClick={handleBanUser}
                className="bg-red-500 text-white px-3 py-2 rounded-anora text-sm hover:bg-red-600 transition-colors"
              >
                Ban
              </button>
            </div>
          </div>

          <div className="bg-white rounded-anora shadow-sm p-4">
            <h3 className="font-medium text-anora-dark mb-2">Unban User</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={anonId}
                onChange={(e) => setAnonId(e.target.value)}
                className="flex-grow px-3 py-2 border border-anora-border rounded-anora text-sm focus:outline-none focus:ring-2 focus:ring-anora-yellow focus:border-transparent"
                placeholder="Anonymous ID"
              />
              <button
                onClick={handleUnbanUser}
                className="bg-green-500 text-white px-3 py-2 rounded-anora text-sm hover:bg-green-600 transition-colors"
              >
                Unban
              </button>
            </div>
          </div>

          <div className="bg-white rounded-anora shadow-sm p-4">
            <h3 className="font-medium text-anora-dark mb-2">Expire Room</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-grow px-3 py-2 border border-anora-border rounded-anora text-sm focus:outline-none focus:ring-2 focus:ring-anora-yellow focus:border-transparent uppercase"
                placeholder="Room Code"
              />
              <button
                onClick={handleExpireRoom}
                className="bg-red-500 text-white px-3 py-2 rounded-anora text-sm hover:bg-red-600 transition-colors"
              >
                Expire
              </button>
            </div>
          </div>

          <div className="bg-white rounded-anora shadow-sm p-4">
            <h3 className="font-medium text-anora-dark mb-2">Verify Room</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-grow px-3 py-2 border border-anora-border rounded-anora text-sm focus:outline-none focus:ring-2 focus:ring-anora-yellow focus:border-transparent uppercase"
                placeholder="Room Code"
              />
              <select
                value={isVerified}
                onChange={(e) => setIsVerified(e.target.value === 'true')}
                className="px-3 py-2 border border-anora-border rounded-anora text-sm focus:outline-none focus:ring-2 focus:ring-anora-yellow focus:border-transparent"
              >
                <option value="false">Unverified</option>
                <option value="true">Verified</option>
              </select>
              <button
                onClick={handleVerifyRoom}
                className="bg-anora-yellow text-anora-dark px-3 py-2 rounded-anora text-sm hover:opacity-90 transition-opacity"
              >
                Set
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-anora shadow-sm mb-6">
          <div className="flex border-b border-anora-border">
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'rooms'
                  ? 'text-anora-yellow border-b-2 border-anora-yellow'
                  : 'text-anora-secondary hover:text-anora-dark'
              }`}
              onClick={() => setActiveTab('rooms')}
            >
              Rooms ({rooms.length})
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'messages'
                  ? 'text-anora-yellow border-b-2 border-anora-yellow'
                  : 'text-anora-secondary hover:text-anora-dark'
              }`}
              onClick={() => setActiveTab('messages')}
            >
              Reported Messages ({messages.length})
            </button>
          </div>

          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-anora-dark mb-4">All Rooms</h2>
              {rooms.length === 0 ? (
                <p className="text-anora-secondary">No rooms found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-anora-border">
                    <thead className="bg-anora-bg">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-anora-secondary uppercase tracking-wider">Room Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-anora-secondary uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-anora-secondary uppercase tracking-wider">Verified</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-anora-secondary uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-anora-secondary uppercase tracking-wider">Expires</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-anora-border">
                      {rooms.map((room) => (
                        <tr key={room._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{room.roomCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-anora-dark">{room.roomName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {room.isVerified ? (
                              <span className="bg-anora-yellow text-anora-dark text-xs px-2 py-1 rounded-full font-medium">
                                Verified
                              </span>
                            ) : (
                              <span className="bg-gray-200 text-anora-dark text-xs px-2 py-1 rounded-full font-medium">
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-anora-secondary">
                            {new Date(room.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-anora-secondary">
                            {new Date(room.expiresAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-anora-dark mb-4">Reported Messages</h2>
              {messages.length === 0 ? (
                <p className="text-anora-secondary">No reported messages</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message._id} className="border border-anora-border rounded-anora p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-gray-200 text-anora-dark px-2 py-1 rounded">
                            {message.roomCode}
                          </span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {message.reports} reports
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-anora-dark mb-2">{message.content}</p>
                      <p className="text-xs text-anora-secondary">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;