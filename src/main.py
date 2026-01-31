import sys
import os
import threading
import time
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QPushButton, QSlider, QListWidget, QListWidgetItem,
    QDialog, QLineEdit, QComboBox, QFileDialog, QMessageBox
)
from PyQt6.QtCore import Qt, QTimer, pyqtSignal, QObject
from PyQt6.QtGui import QPixmap, QFont, QIcon
from PyQt6.QtCore import QSize
from player import Player, PlayerState
from library_manager import LibraryManager, Song
from add_song_dialog import AddSongDialog

class PlayerSignals(QObject):
    song_changed = pyqtSignal()
    state_changed = pyqtSignal()
    position_updated = pyqtSignal(float, float)

class MiniSpotify(QMainWindow):
    def __init__(self):
        super().__init__()
        self.player = Player()
        self.library_manager = LibraryManager()
        self.signals = PlayerSignals()
        self.current_playlist = None
        self.current_song_index = 0
        
        # Setup UI
        self.init_ui()
        
        # Setup timer for position updates
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_position)
        self.timer.start(500)
    
    def init_ui(self):
        """Initialize the user interface."""
        self.setWindowTitle("MiniSpotify")
        self.setGeometry(100, 100, 900, 700)
        
        # Main widget and layout
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QVBoxLayout()
        
        # Top section - Album art and song info
        top_layout = QHBoxLayout()
        
        # Album art
        self.album_art_label = QLabel()
        self.album_art_label.setFixedSize(200, 200)
        self.album_art_label.setStyleSheet("background-color: #1a1a1a; border-radius: 10px;")
        placeholder = QPixmap(200, 200)
        placeholder.fill(Qt.GlobalColor.darkGray)
        self.album_art_label.setPixmap(placeholder)
        
        # Song info
        info_layout = QVBoxLayout()
        
        self.song_title_label = QLabel("No Song Loaded")
        self.song_title_label.setFont(QFont("Arial", 24, QFont.Weight.Bold))
        
        self.song_artist_label = QLabel("Unknown Artist")
        self.song_artist_label.setFont(QFont("Arial", 14))
        self.song_artist_label.setStyleSheet("color: #b3b3b3;")
        
        self.song_album_label = QLabel("Unknown Album")
        self.song_album_label.setFont(QFont("Arial", 12))
        self.song_album_label.setStyleSheet("color: #808080;")
        
        info_layout.addWidget(self.song_title_label)
        info_layout.addWidget(self.song_artist_label)
        info_layout.addWidget(self.song_album_label)
        info_layout.addStretch()
        
        top_layout.addWidget(self.album_art_label)
        top_layout.addLayout(info_layout)
        main_layout.addLayout(top_layout)
        
        # Progress bar section
        progress_layout = QHBoxLayout()
        
        self.time_label = QLabel("00:00")
        self.time_label.setFont(QFont("Arial", 10))
        
        self.progress_slider = QSlider(Qt.Orientation.Horizontal)
        self.progress_slider.setMinimum(0)
        self.progress_slider.sliderMoved.connect(self.seek_position)
        
        self.duration_label = QLabel("00:00")
        self.duration_label.setFont(QFont("Arial", 10))
        
        progress_layout.addWidget(self.time_label)
        progress_layout.addWidget(self.progress_slider)
        progress_layout.addWidget(self.duration_label)
        main_layout.addLayout(progress_layout)
        
        # Control buttons section
        controls_layout = QHBoxLayout()
        
        self.prev_button = QPushButton("⏮ Previous")
        self.prev_button.clicked.connect(self.previous_song)
        
        self.play_pause_button = QPushButton("▶ Play")
        self.play_pause_button.clicked.connect(self.play_pause)
        self.play_pause_button.setFixedWidth(150)
        
        self.next_button = QPushButton("Next ⏭")
        self.next_button.clicked.connect(self.next_song)
        
        self.stop_button = QPushButton("⏹ Stop")
        self.stop_button.clicked.connect(self.stop_playback)
        
        controls_layout.addWidget(self.prev_button)
        controls_layout.addWidget(self.play_pause_button)
        controls_layout.addWidget(self.next_button)
        controls_layout.addWidget(self.stop_button)
        main_layout.addLayout(controls_layout)
        
        # Volume section
        volume_layout = QHBoxLayout()
        
        volume_label = QLabel("Volume:")
        self.volume_slider = QSlider(Qt.Orientation.Horizontal)
        self.volume_slider.setMinimum(0)
        self.volume_slider.setMaximum(100)
        self.volume_slider.setValue(50)
        self.volume_slider.setMaximumWidth(150)
        self.volume_slider.valueChanged.connect(self.set_volume)
        
        self.volume_value_label = QLabel("50%")
        self.volume_value_label.setFixedWidth(40)
        
        volume_layout.addWidget(volume_label)
        volume_layout.addWidget(self.volume_slider)
        volume_layout.addWidget(self.volume_value_label)
        volume_layout.addStretch()
        main_layout.addLayout(volume_layout)
        
        # Playlist and library section
        list_layout = QHBoxLayout()
        
        # Playlist list
        playlist_label = QLabel("Playlists:")
        playlist_label.setFont(QFont("Arial", 12, QFont.Weight.Bold))
        
        playlist_section = QVBoxLayout()
        playlist_section.addWidget(playlist_label)
        
        self.playlist_widget = QListWidget()
        self.playlist_widget.itemClicked.connect(self.load_playlist)
        playlist_section.addWidget(self.playlist_widget)
        
        create_playlist_btn = QPushButton("+ Create Playlist")
        create_playlist_btn.clicked.connect(self.create_playlist)
        playlist_section.addWidget(create_playlist_btn)
        
        # Song list
        song_label = QLabel("Songs:")
        song_label.setFont(QFont("Arial", 12, QFont.Weight.Bold))
        
        song_section = QVBoxLayout()
        song_section.addWidget(song_label)
        
        self.song_widget = QListWidget()
        self.song_widget.itemClicked.connect(self.load_song)
        song_section.addWidget(self.song_widget)
        
        add_song_btn = QPushButton("+ Add Song")
        add_song_btn.clicked.connect(self.add_song_dialog)
        song_section.addWidget(add_song_btn)
        
        list_layout.addLayout(playlist_section)
        list_layout.addLayout(song_section)
        main_layout.addLayout(list_layout)
        
        main_widget.setLayout(main_layout)
        
        # Load initial songs
        self.refresh_song_list()
        self.refresh_playlist_list()
    
    def refresh_song_list(self):
        """Refresh the song list display."""
        self.song_widget.clear()
        songs = self.library_manager.get_all_songs()
        for song in songs:
            item = QListWidgetItem(f"{song.title} - {song.artist}")
            item.setData(Qt.ItemDataRole.UserRole, song.id)
            self.song_widget.addItem(item)
    
    def refresh_playlist_list(self):
        """Refresh the playlist display."""
        self.playlist_widget.clear()
        
        # Add special playlists
        all_item = QListWidgetItem("All Songs")
        all_item.setData(Qt.ItemDataRole.UserRole, "__all__")
        self.playlist_widget.addItem(all_item)
        
        liked_item = QListWidgetItem("❤ Liked Songs")
        liked_item.setData(Qt.ItemDataRole.UserRole, "__liked__")
        self.playlist_widget.addItem(liked_item)
        
        # Add user playlists
        for playlist_name in self.library_manager.get_playlists():
            item = QListWidgetItem(playlist_name)
            item.setData(Qt.ItemDataRole.UserRole, playlist_name)
            self.playlist_widget.addItem(item)
    
    def load_playlist(self, item):
        """Load a playlist."""
        playlist_id = item.data(Qt.ItemDataRole.UserRole)
        
        if playlist_id == "__all__":
            songs = self.library_manager.get_all_songs()
        elif playlist_id == "__liked__":
            songs = self.library_manager.get_liked_songs()
        else:
            songs = self.library_manager.get_playlist_songs(playlist_id)
        
        self.current_playlist = songs
        self.current_song_index = 0
        
        if songs:
            self.load_song_object(songs[0])
    
    def load_song(self, item):
        """Load a song from the list."""
        song_id = item.data(Qt.ItemDataRole.UserRole)
        song = self.library_manager.get_song(song_id)
        if song:
            self.load_song_object(song)
    
    def load_song_object(self, song: Song):
        """Load and display a song."""
        if self.player.load(song.file_path):
            self.song_title_label.setText(song.title)
            self.song_artist_label.setText(song.artist)
            self.song_album_label.setText(song.album)
            self.duration_label.setText(self.format_time(song.duration))
            self.progress_slider.setMaximum(int(song.duration))
            
            # Load album art if exists
            if song.album_art and os.path.exists(song.album_art):
                pixmap = QPixmap(song.album_art)
                self.album_art_label.setPixmap(pixmap.scaledToWidth(200))
    
    def play_pause(self):
        """Toggle play/pause."""
        if self.player.get_state() == PlayerState.PLAYING:
            self.player.pause()
            self.play_pause_button.setText("▶ Play")
        else:
            self.player.play()
            self.play_pause_button.setText("⏸ Pause")
    
    def stop_playback(self):
        """Stop playback."""
        self.player.stop()
        self.play_pause_button.setText("▶ Play")
        self.progress_slider.setValue(0)
    
    def next_song(self):
        """Play next song in playlist."""
        if self.current_playlist and len(self.current_playlist) > 0:
            self.current_song_index = (self.current_song_index + 1) % len(self.current_playlist)
            self.load_song_object(self.current_playlist[self.current_song_index])
            self.player.play()
            self.play_pause_button.setText("⏸ Pause")
    
    def previous_song(self):
        """Play previous song in playlist."""
        if self.current_playlist and len(self.current_playlist) > 0:
            self.current_song_index = (self.current_song_index - 1) % len(self.current_playlist)
            self.load_song_object(self.current_playlist[self.current_song_index])
            self.player.play()
            self.play_pause_button.setText("⏸ Pause")
    
    def update_position(self):
        """Update the progress slider and time labels."""
        if self.player.is_playing():
            position = self.player.get_position()
            self.progress_slider.blockSignals(True)
            self.progress_slider.setValue(int(position))
            self.progress_slider.blockSignals(False)
            self.time_label.setText(self.format_time(position))
    
    def seek_position(self, value):
        """Seek to a position in the song."""
        # Note: pygame mixer doesn't support seeking natively
        # This is a placeholder for future enhancement
        pass
    
    def set_volume(self, value):
        """Set the volume."""
        volume = value / 100.0
        self.player.set_volume(volume)
        self.volume_value_label.setText(f"{value}%")
    
    def add_song_dialog(self):
        """Open dialog to add a song."""
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Select a song",
            "",
            "Audio Files (*.mp3 *.wav *.ogg);;All Files (*)"
        )
        
        if file_path:
            title = os.path.splitext(os.path.basename(file_path))[0]
            dialog = AddSongDialog(title, file_path)
            
            if dialog.exec():
                song_data = dialog.get_song_data()
                song = Song(
                    id=str(len(self.library_manager.songs) + 1),
                    title=song_data['title'],
                    artist=song_data['artist'],
                    album=song_data['album'],
                    duration=0,
                    file_path=file_path,
                    album_art=""
                )
                
                if self.library_manager.add_song(song):
                    self.refresh_song_list()
                    QMessageBox.information(self, "Success", "Song added successfully!")
    
    def create_playlist(self):
        """Create a new playlist."""
        playlist_name, ok = self.get_playlist_name()
        if ok and playlist_name:
            if self.library_manager.create_playlist(playlist_name):
                self.refresh_playlist_list()
                QMessageBox.information(self, "Success", f"Playlist '{playlist_name}' created!")
            else:
                QMessageBox.warning(self, "Error", "Playlist already exists!")
    
    def get_playlist_name(self):
        """Get playlist name from user."""
        from PyQt6.QtWidgets import QInputDialog
        return QInputDialog.getText(self, "Create Playlist", "Playlist name:")
    
    def format_time(self, seconds: float) -> str:
        """Format seconds to MM:SS format."""
        mins = int(seconds) // 60
        secs = int(seconds) % 60
        return f"{mins:02d}:{secs:02d}"

def main():
    app = QApplication(sys.argv)
    
    # Set application style
    app.setStyle('Fusion')
    
    window = MiniSpotify()
    window.show()
    
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
