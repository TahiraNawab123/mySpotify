from PyQt6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QPushButton
)
from PyQt6.QtGui import QFont

class AddSongDialog(QDialog):
    def __init__(self, default_title: str = "", file_path: str = ""):
        super().__init__()
        self.file_path = file_path
        self.init_ui(default_title)
    
    def init_ui(self, default_title: str):
        """Initialize the dialog UI."""
        self.setWindowTitle("Add Song")
        self.setGeometry(200, 200, 400, 200)
        
        layout = QVBoxLayout()
        
        # Title
        title_layout = QHBoxLayout()
        title_label = QLabel("Title:")
        title_label.setFont(QFont("Arial", 10))
        self.title_input = QLineEdit()
        self.title_input.setText(default_title)
        title_layout.addWidget(title_label)
        title_layout.addWidget(self.title_input)
        layout.addLayout(title_layout)
        
        # Artist
        artist_layout = QHBoxLayout()
        artist_label = QLabel("Artist:")
        artist_label.setFont(QFont("Arial", 10))
        self.artist_input = QLineEdit()
        self.artist_input.setPlaceholderText("Enter artist name")
        artist_layout.addWidget(artist_label)
        artist_layout.addWidget(self.artist_input)
        layout.addLayout(artist_layout)
        
        # Album
        album_layout = QHBoxLayout()
        album_label = QLabel("Album:")
        album_label.setFont(QFont("Arial", 10))
        self.album_input = QLineEdit()
        self.album_input.setPlaceholderText("Enter album name")
        album_layout.addWidget(album_label)
        album_layout.addWidget(self.album_input)
        layout.addLayout(album_layout)
        
        # Buttons
        button_layout = QHBoxLayout()
        
        ok_button = QPushButton("Add")
        ok_button.clicked.connect(self.accept)
        
        cancel_button = QPushButton("Cancel")
        cancel_button.clicked.connect(self.reject)
        
        button_layout.addWidget(ok_button)
        button_layout.addWidget(cancel_button)
        layout.addLayout(button_layout)
        
        self.setLayout(layout)
    
    def get_song_data(self) -> dict:
        """Get the entered song data."""
        return {
            'title': self.title_input.text() or "Unknown Title",
            'artist': self.artist_input.text() or "Unknown Artist",
            'album': self.album_input.text() or "Unknown Album"
        }
