#include "playlist.h"
#include <iostream>
#include <iomanip>
#include <iostream>
using namespace std;

Playlist::Playlist() : currentIndex(-1) {}

Playlist::~Playlist() {
    clearPlaylist();
}

void Playlist::addSong(const Song& song) {
    songs.push_back(song);
    if (currentIndex == -1) {
        currentIndex = 0;
    }
}

void Playlist::removeSong(int index) {
    if (index >= 0 && index < static_cast<int>(songs.size())) {
        songs.erase(songs.begin() + index);
        if (currentIndex >= static_cast<int>(songs.size())) {
            currentIndex = songs.size() - 1;
        }
        if (songs.empty()) {
            currentIndex = -1;
        }
    }
}

void Playlist::clearPlaylist() {
    songs.clear();
    currentIndex = -1;
}

Song* Playlist::getCurrentSong() {
    if (currentIndex >= 0 && currentIndex < static_cast<int>(songs.size())) {
        return &songs[currentIndex];
    }
    return nullptr;
}

Song* Playlist::getNextSong() {
    if (currentIndex + 1 < static_cast<int>(songs.size())) {
        currentIndex++;
        return &songs[currentIndex];
    }
    return nullptr;
}

Song* Playlist::getPreviousSong() {
    if (currentIndex - 1 >= 0) {
        currentIndex--;
        return &songs[currentIndex];
    }
    return nullptr;
}

Song* Playlist::getSongAt(int index) {
    if (index >= 0 && index < static_cast<int>(songs.size())) {
        currentIndex = index;
        return &songs[index];
    }
    return nullptr;
}

void Playlist::setCurrentSong(int index) {
    if (index >= 0 && index < static_cast<int>(songs.size())) {
        currentIndex = index;
    }
}

int Playlist::getCurrentIndex() const {
    return currentIndex;
}

int Playlist::getPlaylistSize() const {
    return songs.size();
}

bool Playlist::isEmpty() const {
    return songs.empty();
}

void Playlist::displayPlaylist() const {
    if (isEmpty()) {
        cout << "Playlist is empty!" << endl;
        return;
    }
    
    cout << "\n========== PLAYLIST ==========" << endl;
    for (size_t i = 0; i < songs.size(); ++i) {
        string marker = (i == static_cast<size_t>(currentIndex)) ? " > " : "   ";
        cout << marker << setw(3) << (i + 1) << ". " 
                  << songs[i].title << " - " << songs[i].artist << endl;
    }
    cout << "=============================" << endl;
}

vector<Song>& Playlist::getAllSongs() {
    return songs;
}
