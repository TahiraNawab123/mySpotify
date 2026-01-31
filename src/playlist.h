#ifndef PLAYLIST_H
#define PLAYLIST_H

#include <string>
#include <vector>
#include <memory>

struct Song {
    std::string title;
    std::string artist;
    std::string filePath;
    std::string albumArtPath;
    float duration;
};

class Playlist {
private:
    std::vector<Song> songs;
    int currentIndex;
    
public:
    Playlist();
    ~Playlist();
    
    // Song management
    void addSong(const Song& song);
    void removeSong(int index);
    void clearPlaylist();
    
    // Navigation
    Song* getCurrentSong();
    Song* getNextSong();
    Song* getPreviousSong();
    Song* getSongAt(int index);
    
    void setCurrentSong(int index);
    int getCurrentIndex() const;
    
    // Playlist info
    int getPlaylistSize() const;
    bool isEmpty() const;
    void displayPlaylist() const;
    
    // Utility
    std::vector<Song>& getAllSongs();
};

#endif
