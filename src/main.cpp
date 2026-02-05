#include "player.h"
#include "playlist.h"
#include <iostream>
#include <string>
#include <fstream>
#include <sstream>

void displayMenu() {
    cout << "\n========== MySPOTIFY ==========" << endl;
    cout << "1. Add song to playlist" << endl;
    cout << "2. Display playlist" << endl;
    cout << "3. Play song" << endl;
    cout << "4. Pause song" << endl;
    cout << "5. Resume song" << endl;
    cout << "6. Stop song" << endl;
    cout << "7. Next song" << endl;
    cout << "8. Previous song" << endl;
    cout << "9. Jump to song" << endl;
    cout << "10. Set volume" << endl;
    cout << "11. Show current song info" << endl;
    cout << "12. Load from library.json" << endl;
    cout << "0. Exit" << endl;
    cout << "================================" << endl;
    cout << "Enter your choice: ";
}

void displaySongInfo(Player& player) {
    cout << "\n--- Now Playing ---" << endl;
    cout << "Title: " << player.getCurrentSongTitle() << endl;
    cout << "Current Time: " << static_cast<int>(player.getCurrentTime()) 
              << "s / " << static_cast<int>(player.getDuration()) << "s" << endl;
    cout << "Volume: " << player.getVolume() << "%" << endl;
    cout << "Status: ";
    if (player.getIsPlaying()) {
        cout << "Playing" << endl;
    } else if (player.getIsPaused()) {
        cout << "Paused" << endl;
    } else {
        cout << "Stopped" << endl;
    }
}

bool loadLibraryFromJSON(Playlist& playlist, const string& jsonPath) {
    ifstream file(jsonPath);
    if (!file.is_open()) {
        cerr << "Error: Could not open " << jsonPath << endl;
        return false;
    }
    
    string line;
    int songCount = 0;
    
    // Simple JSON parsing (for basic library.json format)
    while (getline(file, line)) {
        if (line.find("\"title\"") != string::npos) {
            // Extract title
            size_t start = line.find("\"title\": \"") + 10;
            size_t end = line.find("\"", start);
            string title = line.substr(start, end - start);
            
            // Get next lines for artist and path
            getline(file, line);
            size_t artistStart = line.find("\"artist\": \"") + 11;
            size_t artistEnd = line.find("\"", artistStart);
            string artist = line.substr(artistStart, artistEnd - artistStart);
            
            getline(file, line);
            size_t pathStart = line.find("\"filePath\": \"") + 13;
            size_t pathEnd = line.find("\"", pathStart);
            string filePath = line.substr(pathStart, pathEnd - pathStart);
            
            Song song = {title, artist, filePath, "", 0.0f};
            playlist.addSong(song);
            songCount++;
        }
    }
    
    file.close();
    cout << "Loaded " << songCount << " songs from library." << endl;
    return true;
}

int main() {
    Player player;
    Playlist playlist;
    
    cout << "Welcome to MiniSpotify!" << endl;
    
    int choice;
    while (true) {
        displayMenu();
        cin >> choice;
        cin.ignore(); // Clear input buffer
        
        switch (choice) {
            case 1: {
                // Add song manually
                string title, artist, filePath, albumArtPath;
                cout << "Enter song title: ";
                getline(cin, title);
                cout << "Enter artist name: ";
                getline(cin, artist);
                cout << "Enter file path: ";
                getline(cin, filePath);
                cout << "Enter album art path (optional): ";
                getline(cin, albumArtPath);
                
                Song song = {title, artist, filePath, albumArtPath, 0.0f};
                playlist.addSong(song);
                cout << "Song added successfully!" << endl;
                break;
            }
            
            case 2: {
                // Display playlist
                playlist.displayPlaylist();
                break;
            }
            
            case 3: {
                // Play current song
                Song* currentSong = playlist.getCurrentSong();
                if (currentSong) {
                    if (player.loadSong(currentSong->filePath, currentSong->title)) {
                        player.play();
                        cout << "Playing: " << currentSong->title << endl;
                    }
                } else {
                    cout << "No song selected in playlist!" << endl;
                }
                break;
            }
            
            case 4: {
                // Pause song
                player.pause();
                cout << "Song paused." << endl;
                break;
            }
            
            case 5: {
                // Resume song
                player.resume();
                cout << "Song resumed." << endl;
                break;
            }
            
            case 6: {
                // Stop song
                player.stop();
                cout << "Song stopped." << endl;
                break;
            }
            
            case 7: {
                // Next song
                Song* nextSong = playlist.getNextSong();
                if (nextSong) {
                    player.loadSong(nextSong->filePath, nextSong->title);
                    player.play();
                    cout << "Now playing: " << nextSong->title << endl;
                } else {
                    cout << "No next song available." << endl;
                }
                break;
            }
            
            case 8: {
                // Previous song
                Song* prevSong = playlist.getPreviousSong();
                if (prevSong) {
                    player.loadSong(prevSong->filePath, prevSong->title);
                    player.play();
                    cout << "Now playing: " << prevSong->title << endl;
                } else {
                    cout << "No previous song available." << endl;
                }
                break;
            }
            
            case 9: {
                // Jump to specific song
                playlist.displayPlaylist();
                cout << "Enter song number to play: ";
                int songNum;
                cin >> songNum;
                
                Song* selectedSong = playlist.getSongAt(songNum - 1);
                if (selectedSong) {
                    player.loadSong(selectedSong->filePath, selectedSong->title);
                    player.play();
                    cout << "Now playing: " << selectedSong->title << endl;
                } else {
                    cout << "Invalid song number!" << endl;
                }
                break;
            }
            
            case 10: {
                // Set volume
                float volume;
                cout << "Enter volume (0-100): ";
                cin >> volume;
                player.setVolume(volume);
                cout << "Volume set to " << volume << "%" << endl;
                break;
            }
            
            case 11: {
                // Show current song info
                displaySongInfo(player);
                break;
            }
            
            case 12: {
                // Load from library.json
                loadLibraryFromJSON(playlist, "./data/library.json");
                break;
            }
            
            case 0: {
                // Exit
                player.stop();
                cout << "Thank you for using MiniSpotify! Goodbye!" << endl;
                return 0;
            }
            
            default:
                cout << "Invalid choice! Please try again." << endl;
        }
    }
    
    return 0;
}
