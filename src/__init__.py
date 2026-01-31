# MySpotify - Python Music Player
# A modern Spotify-like music player built with PyQt6 and pygame

__version__ = "1.0.0"
__author__ = "MySpotify"

from .player import Player, PlayerState
from .library_manager import LibraryManager, Song

__all__ = ['Player', 'PlayerState', 'LibraryManager', 'Song']
