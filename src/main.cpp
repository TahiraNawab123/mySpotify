#include "player.h"
#include "playlist.h"
#include <iostream>
#include <string>
#include <fstream>
#include <sstream>

void displayMenu() {
    std::cout << "\n========== MINISPOTIFY ==========" << std::endl;
    std::cout << "1. Add song to playlist" << std::endl;
    std::cout << "2. Display playlist" << std::endl;
    std::cout << "3. Play song" << std::endl;
    std::cout << "4. Pause song" << std::endl;
    std::cout << "5. Resume song" << std::endl;
    std::cout << "6. Stop song" << std::endl;
    std::cout << "7. Next song" << std::endl;
    std::cout << "8. Previous song" << std::endl;
    std::cout << "9. Jump to song" << std::endl;
    std::cout << "10. Set volume" << std::endl;
    std::cout << "11. Show current song info" << std::endl;
    std::cout << "12. Load from library.json" << std::endl;
    std::cout << "0. Exit" << std::endl;
    std::cout << "================================" << std::endl;
    std::cout << "Enter your choice: ";
}

void displaySongInfo(Player& player) {
    std::cout << "\n--- Now Playing ---" << std::endl;
    std::cout << "Title: " << player.getCurrentSongTitle() << std::endl;
    std::cout << "Current Time: " << static_cast<int>(player.getCurrentTime()) 
              << "s / " << static_cast<int>(player.getDuration()) << "s" << std::endl;
    std::cout << "Volume: " << player.getVolume() << "%" << std::endl;
    std::cout << "Status: ";
    if (player.getIsPlaying()) {
        std::cout << "Playing" << std::endl;
    } else if (player.getIsPaused()) {
        std::cout << "Paused" << std::endl;
    } else {
        std::cout << "Stopped" << std::endl;
    }
}

bool loadLibraryFromJSON(Playlist& playlist, const std::string& jsonPath) {
    std::ifstream file(jsonPath);
    if (!file.is_open()) {
        std::cerr << "Error: Could not open " << jsonPath << std::endl;
        return false;
    }
    
    std::string line;
    int songCount = 0;
    
    // Simple JSON parsing (for basic library.json format)
    while (std::getline(file, line)) {
        if (line.find("\"title\"") != std::string::npos) {
            // Extract title
            size_t start = line.find("\"title\": \"") + 10;
            size_t end = line.find("\"", start);
            std::string title = line.substr(start, end - start);
            
            // Get next lines for artist and path
            std::getline(file, line);
            size_t artistStart = line.find("\"artist\": \"") + 11;
            size_t artistEnd = line.find("\"", artistStart);
            std::string artist = line.substr(artistStart, artistEnd - artistStart);
            
            std::getline(file, line);
            size_t pathStart = line.find("\"filePath\": \"") + 13;
            size_t pathEnd = line.find("\"", pathStart);
            std::string filePath = line.substr(pathStart, pathEnd - pathStart);
            
            Song song = {title, artist, filePath, "", 0.0f};
            playlist.addSong(song);
            songCount++;
        }
    }
    
    file.close();
    std::cout << "Loaded " << songCount << " songs from library." << std::endl;
    return true;
}

int main() {
    Player player;
    Playlist playlist;
    
    std::cout << "Welcome to MiniSpotify!" << std::endl;
    
    int choice;
    while (true) {
        displayMenu();
        std::cin >> choice;
        std::cin.ignore(); // Clear input buffer
        
        switch (choice) {
            case 1: {
                // Add song manually
                std::string title, artist, filePath, albumArtPath;
                std::cout << "Enter song title: ";
                std::getline(std::cin, title);
                std::cout << "Enter artist name: ";
                std::getline(std::cin, artist);
                std::cout << "Enter file path: ";
                std::getline(std::cin, filePath);
                std::cout << "Enter album art path (optional): ";
                std::getline(std::cin, albumArtPath);
                
                Song song = {title, artist, filePath, albumArtPath, 0.0f};
                playlist.addSong(song);
                std::cout << "Song added successfully!" << std::endl;
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
                        std::cout << "Playing: " << currentSong->title << std::endl;
                    }
                } else {
                    std::cout << "No song selected in playlist!" << std::endl;
                }
                break;
            }
            
            case 4: {
                // Pause song
                player.pause();
                std::cout << "Song paused." << std::endl;
                break;
            }
            
            case 5: {
                // Resume song
                player.resume();
                std::cout << "Song resumed." << std::endl;
                break;
            }
            
            case 6: {
                // Stop song
                player.stop();
                std::cout << "Song stopped." << std::endl;
                break;
            }
            
            case 7: {
                // Next song
                Song* nextSong = playlist.getNextSong();
                if (nextSong) {
                    player.loadSong(nextSong->filePath, nextSong->title);
                    player.play();
                    std::cout << "Now playing: " << nextSong->title << std::endl;
                } else {
                    std::cout << "No next song available." << std::endl;
                }
                break;
            }
            
            case 8: {
                // Previous song
                Song* prevSong = playlist.getPreviousSong();
                if (prevSong) {
                    player.loadSong(prevSong->filePath, prevSong->title);
                    player.play();
                    std::cout << "Now playing: " << prevSong->title << std::endl;
                } else {
                    std::cout << "No previous song available." << std::endl;
                }
                break;
            }
            
            case 9: {
                // Jump to specific song
                playlist.displayPlaylist();
                std::cout << "Enter song number to play: ";
                int songNum;
                std::cin >> songNum;
                
                Song* selectedSong = playlist.getSongAt(songNum - 1);
                if (selectedSong) {
                    player.loadSong(selectedSong->filePath, selectedSong->title);
                    player.play();
                    std::cout << "Now playing: " << selectedSong->title << std::endl;
                } else {
                    std::cout << "Invalid song number!" << std::endl;
                }
                break;
            }
            
            case 10: {
                // Set volume
                float volume;
                std::cout << "Enter volume (0-100): ";
                std::cin >> volume;
                player.setVolume(volume);
                std::cout << "Volume set to " << volume << "%" << std::endl;
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
                std::cout << "Thank you for using MiniSpotify! Goodbye!" << std::endl;
                return 0;
            }
            
            default:
                std::cout << "Invalid choice! Please try again." << std::endl;
        }
    }
    
    return 0;
}
