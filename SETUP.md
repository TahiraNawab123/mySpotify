## mySpotify - Complete Setup Guide

A professional web-based music player inspired by Spotify with a modern dark theme, animated background effects, and full playback control.

## Project Structure

```
mySpotify/
├── backend/
│   ├── app.py                 # Flask API server
│   └── requirements.txt       # Python dependencies
├── app/
│   ├── page.tsx               # Main music player UI
│   ├── layout.tsx             # App layout
│   ├── globals.css            # Theme and animations
│   └── api/                   # Next.js API routes
├── components/
│   └── [UI components]
├── types/
│   └── index.ts               # TypeScript interfaces
├── data/
│   └── library.json           # Music library storage
├── assets/
│   └── songs/                 # Local music files
└── package.json               # Frontend dependencies
```

## Features

✓ Play, pause, resume, stop music playback
✓ Skip to next/previous tracks
✓ Volume control (0-100%)
✓ Progress bar with seek functionality
✓ Like/unlike songs
✓ Playlist management
✓ Album art display with animated visualizer
✓ Dark theme with animated disco light effects
✓ Responsive design (desktop-first, mobile support)
✓ Local music file storage
✓ JSON-based library persistence

## Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.8+ (for backend)
- **npm** or **yarn** (for package management)
- **pip** (for Python packages)

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables (if needed)

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Flask Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

### 4. API Endpoints

- `GET /api/health` - Health check
- `GET /api/songs` - Get all songs
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create new playlist
- `POST /api/playlists/<name>/add` - Add song to playlist
- `POST /api/songs/<id>/like` - Toggle like status
- `POST /api/player/play` - Play a song
- `POST /api/player/pause` - Pause playback
- `POST /api/player/resume` - Resume playback
- `POST /api/player/stop` - Stop playback
- `POST /api/player/volume` - Set volume
- `GET /api/player/status` - Get player status

## Adding Music Files

1. Place MP3/OGG/WAV files in `assets/songs/`
2. Update `data/library.json` with song metadata:

```json
{
  "songs": [
    {
      "id": "1",
      "title": "Song Title",
      "artist": "Artist Name",
      "album": "Album Name",
      "duration": 200,
      "file_path": "assets/songs/song.mp3",
      "liked": false
    }
  ],
  "playlists": {
    "Favorites": ["1", "2"]
  }
}
```

## Usage

1. **Start both servers** (frontend and backend)
2. **View the app** at `http://localhost:3000`
3. **Click a song** in the right panel to play
4. **Use controls** at bottom-left to play/pause/skip
5. **Like songs** by clicking the heart icon
6. **Adjust volume** with the volume slider
7. **Create playlists** through the backend API

## Design Details

### Color Scheme
- **Primary Green**: #1DB954 (Spotify's signature green)
- **Background**: #000000 (Pure black)
- **Secondary**: #1a1a1a (Dark gray)
- **Text**: #ffffff (White)
- **Accents**: Purple, Blue, Red (subtle animated disco lights)

### Layout
- **Left Panel (2/5)**: Now playing - album art, song info, progress, controls
- **Right Panel (3/5)**: Playlist - song list with durations and like buttons
- **Top Bar**: App branding "MiniSpotify" with creator credit

### Animations
- Pulsing disco light effects in background
- Animated visualizer bars when playing
- Smooth transitions on button hover
- Scale effects on play button interaction

## Troubleshooting

### Backend won't start
```bash
# Clear Python cache
rm -r backend/__pycache__

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't compile
```bash
# Clear Next.js cache
rm -r .next

# Reinstall dependencies
npm install --force
npm run dev
```

### No audio playing
- Ensure audio files exist in correct path
- Check browser console for CORS errors
- Verify backend is running on port 5000
- Check file format (MP3, WAV, OGG supported)

### Volume not responding
- Ensure browser allows audio control
- Check backend volume endpoint is working
- Verify mixer initialized properly

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel with next export
```

### Backend (Heroku/Railway)
```bash
# Push to Heroku with Procfile
web: python app.py
```

## Technologies Used

**Frontend:**
- React 19
- Next.js 16
- Tailwind CSS
- Lucide React Icons

**Backend:**
- Flask 2.3
- pygame (audio)
- Flask-CORS

**Data:**
- JSON (library storage)
- Local file system

## Creator

Made by **Tahira Nawab**

This is a learning project to demonstrate full-stack web development with music streaming functionality.
