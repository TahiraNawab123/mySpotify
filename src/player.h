#ifndef PLAYER_H
#define PLAYER_H

#include <SFML/Audio.hpp>
#include <string>
#include <vector>
#include <memory>

class Player {
private:
    sf::Music music;
    bool isPlaying;
    bool isPaused;
    std::string currentSongPath;
    std::string currentSongTitle;
    
public:
    Player();
    ~Player();
    
    // Playback controls
    bool loadSong(const std::string& filePath, const std::string& title);
    void play();
    void pause();
    void stop();
    void resume();
    
    // Status getters
    bool getIsPlaying() const;
    bool getIsPaused() const;
    std::string getCurrentSongTitle() const;
    std::string getCurrentSongPath() const;
    float getDuration() const;
    float getCurrentTime() const;
    
    // Volume control
    void setVolume(float volume); // 0.0 to 100.0
    float getVolume() const;
    
    // Seek functionality
    void seek(float timeInSeconds);
};

#endif
