from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import json
import os
from pathlib import Path
import time
from pygame import mixer
import threading

app = Flask(__name__)
CORS(app)

# Initialize mixer for audio playback
mixer.init()

# Data storage
LIBRARY_FILE = 'data/library.json'
SONGS_DIR = 'assets/songs/'

# Player state
player_state = {
    'current_song_id': None,
    'is_playing': False,
    'volume': 70,
    'current_time': 0,
    'duration': 0,
}

def load_library():
    """Load library from JSON file"""
    if os.path.exists(LIBRARY_FILE):
        with open(LIBRARY_FILE, 'r') as f:
            return json.load(f)
    return {'songs': [], 'playlists': {}, 'likes': []}

def save_library(library):
    """Save library to JSON file"""
    os.makedirs(os.path.dirname(LIBRARY_FILE), exist_ok=True)
    with open(LIBRARY_FILE, 'w') as f:
        json.dump(library, f, indent=2)

def initialize_sample_library():
    """Create sample library if it doesn't exist"""
    library = load_library()
    
    if not library.get('songs'):
        library['songs'] = [
            {
                'id': '1',
                'title': 'Blinding Lights',
                'artist': 'The Weeknd',
                'album': 'After Hours',
                'duration': 200,
                'file_path': 'assets/songs/song1.mp3',
                'liked': False
            },
            {
                'id': '2',
                'title': 'Levitating',
                'artist': 'Dua Lipa',
                'album': 'Future Nostalgia',
                'duration': 203,
                'file_path': 'assets/songs/song2.mp3',
                'liked': False
            },
            {
                'id': '3',
                'title': 'Good as Hell',
                'artist': 'Lizzo',
                'album': 'Cuz I Love You',
                'duration': 206,
                'file_path': 'assets/songs/song3.mp3',
                'liked': False
            },
        ]
        
        library['playlists'] = {
            'Favorites': ['1', '2'],
            'Chill Vibes': ['2', '3'],
        }
        
        save_library(library)
    
    return library

# API Routes

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'MiniSpotify Backend Running'})

@app.route('/api/songs', methods=['GET'])
def get_songs():
    """Get all songs"""
    library = load_library()
    return jsonify(library.get('songs', []))

@app.route('/api/playlists', methods=['GET'])
def get_playlists():
    """Get all playlists"""
    library = load_library()
    playlists_data = library.get('playlists', {})
    
    # Format playlists with song details
    formatted_playlists = {}
    for name, song_ids in playlists_data.items():
        songs = [s for s in library.get('songs', []) if s['id'] in song_ids]
        formatted_playlists[name] = {
            'name': name,
            'songs': songs,
            'count': len(songs)
        }
    
    return jsonify(formatted_playlists)

@app.route('/api/playlists', methods=['POST'])
def create_playlist():
    """Create a new playlist"""
    data = request.json
    name = data.get('name', 'New Playlist')
    
    library = load_library()
    library['playlists'][name] = []
    save_library(library)
    
    return jsonify({'success': True, 'name': name})

@app.route('/api/playlists/<playlist_name>/add', methods=['POST'])
def add_to_playlist(playlist_name):
    """Add song to playlist"""
    data = request.json
    song_id = data.get('song_id')
    
    library = load_library()
    if playlist_name in library['playlists']:
        if song_id not in library['playlists'][playlist_name]:
            library['playlists'][playlist_name].append(song_id)
            save_library(library)
            return jsonify({'success': True})
    
    return jsonify({'success': False})

@app.route('/api/songs/<song_id>/like', methods=['POST'])
def toggle_like(song_id):
    """Toggle like status for a song"""
    library = load_library()
    
    for song in library.get('songs', []):
        if song['id'] == song_id:
            song['liked'] = not song['liked']
            break
    
    save_library(library)
    return jsonify({'success': True, 'song_id': song_id})

@app.route('/api/player/play', methods=['POST'])
def play_song():
    """Play a song"""
    data = request.json
    song_id = data.get('song_id')
    
    library = load_library()
    song = next((s for s in library.get('songs', []) if s['id'] == song_id), None)
    
    if song:
        player_state['current_song_id'] = song_id
        player_state['is_playing'] = True
        
        try:
            mixer.music.load(song['file_path'])
            mixer.music.play()
            player_state['duration'] = mixer.Sound(song['file_path']).get_length()
        except:
            return jsonify({'success': False, 'error': 'Could not load song'})
        
        return jsonify({'success': True, 'song': song})
    
    return jsonify({'success': False, 'error': 'Song not found'})

@app.route('/api/player/pause', methods=['POST'])
def pause_song():
    """Pause playback"""
    mixer.music.pause()
    player_state['is_playing'] = False
    return jsonify({'success': True})

@app.route('/api/player/resume', methods=['POST'])
def resume_song():
    """Resume playback"""
    mixer.music.unpause()
    player_state['is_playing'] = True
    return jsonify({'success': True})

@app.route('/api/player/stop', methods=['POST'])
def stop_song():
    """Stop playback"""
    mixer.music.stop()
    player_state['is_playing'] = False
    player_state['current_time'] = 0
    return jsonify({'success': True})

@app.route('/api/player/volume', methods=['POST'])
def set_volume():
    """Set volume (0-100)"""
    data = request.json
    volume = max(0, min(100, data.get('volume', 70)))
    
    player_state['volume'] = volume
    mixer.music.set_volume(volume / 100)
    
    return jsonify({'success': True, 'volume': volume})

@app.route('/api/player/status', methods=['GET'])
def get_player_status():
    """Get current player status"""
    return jsonify({
        'current_song_id': player_state['current_song_id'],
        'is_playing': player_state['is_playing'],
        'volume': player_state['volume'],
        'current_time': player_state['current_time'],
        'duration': player_state['duration'],
    })

if __name__ == '__main__':
    initialize_sample_library()
    app.run(debug=True, port=5000)
