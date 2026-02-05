#include "player.h"
#include <iostream>

Player::Player() : isPlaying(false), isPaused(false) {}

Player::~Player() {
    stop();
}

bool Player::loadSong(const string& filePath, const string& title) {
    if (!music.openFromFile(filePath)) {
        cerr << "Error: Could not load song from " << filePath << endl;
        return false;
    }
    currentSongPath = filePath;
    currentSongTitle = title;
    return true;
}

void Player::play() {
    if (!isPlaying) {
        music.play();
        isPlaying = true;
        isPaused = false;
    }
}

void Player::pause() {
    if (isPlaying && !isPaused) {
        music.pause();
        isPaused = true;
    }
}

void Player::stop() {
    music.stop();
    isPlaying = false;
    isPaused = false;
}

void Player::resume() {
    if (isPaused) {
        music.play();
        isPaused = false;
    }
}

bool Player::getIsPlaying() const {
    return isPlaying && music.getStatus() == sf::Music::Status::Playing;
}

bool Player::getIsPaused() const {
    return isPaused;
}

std::string Player::getCurrentSongTitle() const {
    return currentSongTitle;
}

std::string Player::getCurrentSongPath() const {
    return currentSongPath;
}

float Player::getDuration() const {
    return music.getDuration().asSeconds();
}

float Player::getCurrentTime() const {
    return music.getPlayingOffset().asSeconds();
}

void Player::setVolume(float volume) {
    // Clamp volume between 0 and 100
    if (volume < 0.0f) volume = 0.0f;
    if (volume > 100.0f) volume = 100.0f;
    music.setVolume(volume);
}

float Player::getVolume() const {
    return music.getVolume();
}

void Player::seek(float timeInSeconds) {
    music.setPlayingOffset(sf::seconds(timeInSeconds));
}
