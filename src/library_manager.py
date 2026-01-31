import json
import os
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict

@dataclass
class Song:
    id: str
    title: str
    artist: str
    album: str
    duration: float
    file_path: str
    album_art: str = ""
    liked: bool = False

class LibraryManager:
    def __init__(self, library_path: str = "data/library.json"):
        self.library_path = library_path
        self.songs: List[Song] = []
        self.playlists: Dict[str, List[str]] = {}
        self.load_library()
    
    def load_library(self) -> None:
        """Load music library from JSON."""
        try:
            if os.path.exists(self.library_path):
                with open(self.library_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                    # Load songs
                    for song_data in data.get('songs', []):
                        song = Song(**song_data)
                        self.songs.append(song)
                    
                    # Load playlists
                    self.playlists = data.get('playlists', {})
            else:
                print(f"Library file not found at {self.library_path}")
        except Exception as e:
            print(f"Error loading library: {e}")
    
    def save_library(self) -> bool:
        """Save music library to JSON."""
        try:
            # Ensure directory exists
            os.makedirs(os.path.dirname(self.library_path), exist_ok=True)
            
            data = {
                'songs': [asdict(song) for song in self.songs],
                'playlists': self.playlists
            }
            
            with open(self.library_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"Error saving library: {e}")
        return False
    
    def add_song(self, song: Song) -> bool:
        """Add a song to the library."""
        if not any(s.id == song.id for s in self.songs):
            self.songs.append(song)
            return self.save_library()
        return False
    
    def remove_song(self, song_id: str) -> bool:
        """Remove a song from the library."""
        self.songs = [s for s in self.songs if s.id != song_id]
        return self.save_library()
    
    def get_all_songs(self) -> List[Song]:
        """Get all songs in library."""
        return self.songs
    
    def get_song(self, song_id: str) -> Optional[Song]:
        """Get a specific song by ID."""
        for song in self.songs:
            if song.id == song_id:
                return song
        return None
    
    def toggle_like(self, song_id: str) -> bool:
        """Toggle like status for a song."""
        song = self.get_song(song_id)
        if song:
            song.liked = not song.liked
            return self.save_library()
        return False
    
    def get_liked_songs(self) -> List[Song]:
        """Get all liked songs."""
        return [s for s in self.songs if s.liked]
    
    def create_playlist(self, playlist_name: str) -> bool:
        """Create a new playlist."""
        if playlist_name not in self.playlists:
            self.playlists[playlist_name] = []
            return self.save_library()
        return False
    
    def add_to_playlist(self, playlist_name: str, song_id: str) -> bool:
        """Add a song to a playlist."""
        if playlist_name in self.playlists:
            if song_id not in self.playlists[playlist_name]:
                self.playlists[playlist_name].append(song_id)
                return self.save_library()
        return False
    
    def remove_from_playlist(self, playlist_name: str, song_id: str) -> bool:
        """Remove a song from a playlist."""
        if playlist_name in self.playlists:
            if song_id in self.playlists[playlist_name]:
                self.playlists[playlist_name].remove(song_id)
                return self.save_library()
        return False
    
    def get_playlist_songs(self, playlist_name: str) -> List[Song]:
        """Get all songs in a playlist."""
        if playlist_name not in self.playlists:
            return []
        song_ids = self.playlists[playlist_name]
        return [self.get_song(sid) for sid in song_ids if self.get_song(sid)]
    
    def get_playlists(self) -> List[str]:
        """Get all playlist names."""
        return list(self.playlists.keys())
    
    def delete_playlist(self, playlist_name: str) -> bool:
        """Delete a playlist."""
        if playlist_name in self.playlists:
            del self.playlists[playlist_name]
            return self.save_library()
        return False
