# ANORA - Anonymous Room-Based Communication

ANORA is a privacy-first, anonymous room-based application where users can communicate honestly without revealing their identity.

## Features

- **Anonymous Identity**: UUID-based anonId, persistent per device, display name always "Anonymous"
- **Room System**: Create/join rooms with auto-expiration (24h or 7d)
- **Real-Time Chat**: Socket.io based instant messaging
- **Message Controls**: Edit/delete own messages (≤ 2 min)
- **Safety & Moderation**: Profanity filter, rate limiting, report system, shadow-banning
- **Verified Rooms**: Admin-only toggle for trust indicators
- **Admin Panel**: Hidden access with secret for moderation

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Socket.io client, Axios, UUID
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose, Socket.io
- **Security**: Helmet, express-rate-limit, CORS, input sanitization

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/anora?retryWrites=true&w=majority

   # Server
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Admin
   ADMIN_SECRET=your_admin_secret_here

   # Security
   JWT_SECRET=your_jwt_secret_here
   ```

### Frontend Setup

1. Navigate to the src directory:
   ```bash
   cd src
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode

1. In the root directory, install all dependencies:
   ```bash
   npm run install-all
   ```

2. Run both frontend and backend simultaneously:
   ```bash
   npm run dev
   ```

3. The application will be available at `http://localhost:5173`

#### Production Mode

1. Build the frontend:
   ```bash
   cd src && npm run build
   ```

2. Start the backend server:
   ```bash
   cd server && npm start
   ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Frontend URL for CORS
- `ADMIN_SECRET`: Secret key to access admin panel

## API Endpoints

### Rooms
- `POST /api/rooms/create` - Create a new room
- `GET /api/rooms/:roomCode` - Get room details
- `POST /api/rooms/join` - Join a room
- `GET /api/rooms/check-expiry/:roomCode` - Check room expiry

### Admin
- `GET /api/admin/rooms` - Get all rooms
- `GET /api/admin/messages` - Get reported messages
- `DELETE /api/admin/messages/:messageId` - Delete a message
- `POST /api/admin/users/ban` - Ban a user
- `POST /api/admin/users/unban` - Unban a user
- `POST /api/admin/rooms/expire` - Expire a room
- `POST /api/admin/rooms/verify` - Verify a room

## Socket Events

- `join-room` - Join a room
- `leave-room` - Leave a room
- `send-message` - Send a message
- `new-message` - Receive a new message
- `edit-message` - Edit a message
- `delete-message` - Delete a message
- `report-message` - Report a message
- `message-deleted` - Message deleted notification
- `user-banned` - User banned notification

## Admin Panel

Access the admin panel at `/admin` route. You'll need to enter the admin secret to access it.

Admin capabilities:
- View all rooms
- View reported messages
- Delete messages
- Ban/unban users
- Expire rooms
- Mark rooms as verified

## Database Schema

### Room
```javascript
{
  roomCode: String (unique, uppercase),
  roomName: String,
  isVerified: Boolean,
  expiresAt: Date,
  createdAt: Date
}
```

### AnonymousUser
```javascript
{
  anonId: String (unique),
  deviceHash: String (hashed),
  banned: Boolean,
  createdAt: Date
}
```

### Message
```javascript
{
  roomCode: String,
  anonId: String,
  content: String,
  reports: Number,
  createdAt: Date,
  expiresAt: Date
}
```

## Security Features

- All messages automatically expire after 24 hours
- Rooms auto-expire after set time (24h or 7d)
- Profanity filtering on messages
- Rate limiting per IP and per user
- Shadow banning for abusive users
- No personal information stored

## Privacy Policy

- No login required
- No usernames or profiles
- No phone/email required
- Only anonymous presence inside rooms
- Messages auto-delete after 24 hours
- Room data auto-deletes after expiry
- All data stored only on backend database