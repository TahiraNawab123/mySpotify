# 🎵 mySpotify
This is a Spotify-inspired music player.

## Project Overview
 
**mySpotify** is a lightweight music-streaming style application that allows users to browse songs, play audio tracks, and manage playlists.

mySpotify is a full-stack music player that demonstrates core streaming app functionality: browsing a library, playing audio tracks, managing playback state, and organizing content through playlists and favorites. Built with a clean separation between frontend (React/Next.js) and backend (Flask).

---

## Implemented Features

- Play, pause, resume and stop audio playback
- Skip to next and previous tracks
- Volume control
- Track progress and seeking
- Display of song metadata: title, artist, duration, and album art
- Like/unlike (favorites) songs
- Playlist creation and management backed by JSON (data/library.json)
- Local audio file support (assets/songs/)
- Animated UI elements (visualizer bars, pulsing/animated background)
- Dark theme and responsive layout (desktop-first)
- Backend API to manage songs, playlists, likes, and player actions
- The repo also contains a SFML folder (binaries) alongside the Flask/pygame backend; the active backend implementation uses Flask and pygame as shown in backend/.

### Interface & Experience
- **Dark Theme**, Spotify-inspired dark interface 
- **Animated Visualizer**, Animated disco light effects in the UI
- **Album Art Display**, Show artwork for each track
- **Responsive Layout**, Works on desktop screens
- **Smooth Animations**, Polished UI transitions and visual feedback

### Data Management
- **JSON-Based Library** Songs and playlists stored in `library.json`
- **Local Audio Storage** Music files kept in `assets/songs/` directory

---

## Tech Stack

# Frontend
- Next.js + React (TypeScript)
- Tailwind CSS for styling
- Local React/TypeScript components in app/ and components/
# Backend
- Flask (Python) API server (backend/app.py)
- pygame used for server-side audio handling
- Flask-CORS for cross-origin requests
# Data & storage
- JSON (data/library.json) for song and playlist persistence
- Local audio files stored under assets/songs/
# Tooling
- Node.js / npm for frontend dependencies
- pip for Python backend dependencies
- Makefile included for convenience tasks

## Project Structure

```
mySpotify/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main player UI
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles & theme
│   └── api/
│       └── songs/
│           ├── route.ts          # GET all songs
│           └── [id]/
│               └── route.ts      # GET/PATCH individual songs
│
├── components/                   # React components
│   ├── ControlBar.tsx            # Playback controls & volume
│   ├── PlayerCard.tsx            # Now playing display
│   └── PlaylistPanel.tsx         # Playlist sidebar
│
├── types/                        # TypeScript definitions
│   └── index.ts                  # Song and Playlist interfaces
│
├── backend/                      # Python Flask server
│   ├── app.py                    # Main API server
│   └── requirements.txt          # Python dependencies
│
├── data/                         # Application data
│   └── library.json              # Song and playlist storage
│
├── assets/                       # Static files
│   └── songs/                    # Local music files
│
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
└── Makefile                      # Build commands
```

## Installation & setup
# Prerequisites

- Node.js (modern LTS recommended)
- npm (or yarn)
- Python 3.8+
- pip

1. Clone the repository
```bash
git clone https://github.com/TahiraNawab123/mySpotify.git
cd mySpotify
```
2. Frontend (from repo root)
```bash
npm install
```
3. Backend
```bash
cd backend
python -m venv venv                      # optional but recommended
```
# Activate the virtual environment:
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

```bash 
pip install -r requirements.txt
```
# Running the project
1. Start the backend (in backend/ virtual environment)
```bash
python app.py
```
# Start the frontend
```bash
npm run dev
```

## How to Use

1. **Browse the Library** — View all available songs on the main page
2. **Play a Song** — Click the play button on any track
3. **Control Playback** — Use the control bar to play/pause, skip, and adjust volume
4. **Like Tracks** — Click the heart icon to mark favorites
5. **Manage Playlists** — View and manage playlists from the sidebar
6. **Seek in Tracks** — Click the progress bar to jump to a specific time

---

## Known Issues & Work in Progress

- **Playlist Creation UI** — Backend supports playlists, but frontend UI for creation is partial
- **Search Functionality** — Not yet implemented
- **Real Audio File Handling** — Backend uses pygame.mixer; streaming optimization needed
- **Mobile Responsiveness** — Desktop-first design; mobile layout could be improved
- **Persistent User Settings** — Volume and playback state reset on refresh
- **Library Initialization** — Sample library loads on first run; needs improvement for custom music

---

## Future Improvements

- **Search & Filter** — Search songs by title, artist, or album
- **Shuffle & Repeat** — Add playback mode options
- **Queue Management** — View and edit upcoming songs
- **Theme Options** — Light/dark mode toggle
- **User Authentication** — Sign up, login, and personalized libraries
- **Advanced Playlists** — Collaborative playlists, auto-generated playlists
- **Audio Visualization** — Spectrum analyzer or waveform display
- **Media Keyboard Support** — Control playback with keyboard shortcuts
- **Streaming Integration** — Connect to external music APIs
- **Social Features** — Share playlists and track recommendations
- **Mobile App** — React Native version for phones/tablets
---

# Author
Tahira Nawab
GitHub: @TahiraNawab123

