'use client'

import { useState, useEffect, useRef } from 'react'
import { Music, Heart, Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from 'lucide-react'
import { Song } from '@/types'

// Extended song list with 12 tracks
const SAMPLE_SONGS: Song[] = [
  { 
    id: '1', 
    title: 'Blinding Lights', 
    artist: 'The Weeknd', 
    album: 'After Hours', 
    duration: 200, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  { 
    id: '2', 
    title: 'Levitating', 
    artist: 'Dua Lipa', 
    album: 'Future Nostalgia', 
    duration: 203, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop'
  },
  { 
    id: '3', 
    title: 'Good as Hell', 
    artist: 'Lizzo', 
    album: 'Cuz I Love You', 
    duration: 206, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop'
  },
  { 
    id: '4', 
    title: 'Watermelon Sugar', 
    artist: 'Harry Styles', 
    album: 'Fine Line', 
    duration: 174, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop'
  },
  { 
    id: '5', 
    title: 'Don\'t Start Now', 
    artist: 'Dua Lipa', 
    album: 'Future Nostalgia', 
    duration: 183, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop'
  },
  { 
    id: '6', 
    title: 'Circles', 
    artist: 'Post Malone', 
    album: 'Hollywood\'s Bleeding', 
    duration: 215, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop'
  },
  { 
    id: '7', 
    title: 'Say So', 
    artist: 'Doja Cat', 
    album: 'Hot Pink', 
    duration: 237, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop'
  },
  { 
    id: '8', 
    title: 'Savage', 
    artist: 'Megan Thee Stallion', 
    album: 'Suga', 
    duration: 179, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  { 
    id: '9', 
    title: 'Intentions', 
    artist: 'Justin Bieber', 
    album: 'Changes', 
    duration: 193, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop'
  },
  { 
    id: '10', 
    title: 'Adore You', 
    artist: 'Harry Styles', 
    album: 'Fine Line', 
    duration: 207, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop'
  },
  { 
    id: '11', 
    title: 'The Box', 
    artist: 'Roddy Ricch', 
    album: 'Please Excuse Me', 
    duration: 196, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop'
  },
  { 
    id: '12', 
    title: 'Stuck with U', 
    artist: 'Ariana Grande & Justin Bieber', 
    album: 'Stuck with U', 
    duration: 228, 
    liked: false,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop'
  },
]

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function Home() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [songs, setSongs] = useState<Song[]>(SAMPLE_SONGS)
  const [playlist] = useState<string[]>(SAMPLE_SONGS.map(s => s.id))
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const nextSongRef = useRef<HTMLAudioElement>(null) // Preload next song

  const currentSong = songs.find(s => s.id === playlist[currentSongIndex])

  // Get audio source URL - using placeholder URLs that can be replaced with actual MP3 files
  const getAudioSrc = (songId: string) => {
    // Try local file first, fallback to demo URL
    return `/songs/${songId}.mp3`
  }

  // Update audio source when song changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    setIsLoading(true)
    const src = getAudioSrc(currentSong.id)
    
    // Reset progress when changing songs
    setProgress(0)
    setCurrentTime(0)
    
    // Set new source
    audio.src = src
    audio.load()
    
    // Handle loaded metadata
    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration)
        // Update song duration if it was wrong
        if (Math.abs(audio.duration - currentSong.duration) > 5) {
          setSongs(prev => prev.map(s => 
            s.id === currentSong.id ? { ...s, duration: Math.floor(audio.duration) } : s
          ))
        }
      }
      setIsLoading(false)
    }

    // Handle can play
    const handleCanPlay = () => {
      setIsLoading(false)
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Playback error:', err)
          setIsPlaying(false)
        })
      }
    }

    // Handle errors
    const handleError = () => {
      console.error('Audio load error for:', src)
      setIsLoading(false)
      setIsPlaying(false)
      // Try fallback demo URL
      if (!src.includes('http')) {
        audio.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${currentSong.id}.mp3`
        audio.load()
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
    }
  }, [currentSongIndex, currentSong?.id])

  // Preload next song
  useEffect(() => {
    if (!nextSongRef.current) return
    const nextIndex = (currentSongIndex + 1) % playlist.length
    const nextSong = songs.find(s => s.id === playlist[nextIndex])
    if (nextSong) {
      nextSongRef.current.src = getAudioSrc(nextSong.id)
      nextSongRef.current.load()
    }
  }, [currentSongIndex, playlist, songs])

  // Update progress & handle song end
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration && isFinite(audio.duration)) {
        const newProgress = (audio.currentTime / audio.duration) * 100
        setProgress(newProgress)
        setCurrentTime(audio.currentTime)
      }
    }

    const handleEnded = () => {
      // Auto-play next song
      const nextIndex = (currentSongIndex + 1) % playlist.length
      setCurrentSongIndex(nextIndex)
      setIsPlaying(true)
    }

    const handleTimeUpdate = () => updateProgress()
    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [currentSongIndex, playlist.length])

  // Play/pause audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started
          })
          .catch(error => {
            console.error('Playback failed:', error)
            setIsPlaying(false)
          })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Adjust volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const playNext = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length
    setCurrentSongIndex(nextIndex)
    setIsPlaying(true)
  }

  const playPrevious = () => {
    const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length
    setCurrentSongIndex(prevIndex)
    setIsPlaying(true)
  }

  const toggleLike = (songId: string) => {
    setSongs(prev => prev.map(s => (s.id === songId ? { ...s, liked: !s.liked } : s)))
  }

  const handleProgressChange = (newProgress: number) => {
    const audio = audioRef.current
    if (audio && audio.duration && isFinite(audio.duration)) {
      audio.currentTime = (newProgress / 100) * audio.duration
      setProgress(newProgress)
      setCurrentTime(audio.currentTime)
    }
  }

  const handleSelectSong = (songId: string) => {
    const index = playlist.indexOf(songId)
    if (index !== -1) {
      setCurrentSongIndex(index)
      setIsPlaying(true)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="disco-background" />
      <div className="disco-light disco-light-1" />
      <div className="disco-light disco-light-2" />
      <div className="disco-light disco-light-3" />
      <div className="disco-light disco-light-4" />
      
      {/* Hidden audio elements */}
      <audio 
        ref={audioRef} 
        crossOrigin="anonymous"
        preload="auto"
        onError={(e) => {
          console.error('Audio error:', e)
          setIsLoading(false)
        }}
      />
      <audio ref={nextSongRef} preload="auto" style={{ display: 'none' }} />

      {/* Top Navigation */}
      <div className="relative z-20 border-b shadow-lg border-purple-500/20 backdrop-blur-xl bg-black/40 shadow-purple-900/20">
        <div className="px-8 py-4">
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-pulse">my</span>Spotify
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-400">Made by Tahira Nawab</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Left Panel - Now Playing */}
        <div className="flex flex-col w-full px-8 py-6 overflow-hidden border-r lg:w-2/5 sidebar-left border-purple-500/20">
          {/* Song Info */}
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-4xl font-black text-white line-clamp-2 drop-shadow-lg">
              {currentSong?.title || 'No Song'}
            </h2>
            <p className="mb-1 text-xl font-semibold text-purple-400">{currentSong?.artist || 'Unknown'}</p>
            <p className="text-sm text-gray-500">{currentSong?.album || 'No Album'}</p>
          </div>

          {/* Album Art */}
          <div className="w-full max-w-xs mx-auto mb-8">
            <div className="relative overflow-hidden border-2 shadow-2xl aspect-square rounded-2xl group border-purple-500/30">
              {currentSong?.imageUrl ? (
                <img 
                  src={currentSong.imageUrl} 
                  alt={currentSong.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-600/40 via-pink-600/40 to-black">
                  <Music className="w-24 h-24 text-purple-400/50" />
                </div>
              )}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent animate-spin" />
                </div>
              )}
              {isPlaying && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                  <div className="flex gap-1.5 items-end h-16">
                    {[15, 24, 18, 22, 16, 20, 14].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"
                        style={{ 
                          height: `${h}px`, 
                          animation: `equalizer ${0.4 + i * 0.1}s ease-in-out infinite`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mx-auto mb-8">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => handleProgressChange(Number(e.target.value))}
              className="w-full h-2 transition-all rounded-full appearance-none cursor-pointer bg-white/10 accent-purple-500 hover:accent-purple-400 slider"
              style={{
                background: `linear-gradient(to right, rgb(124, 58, 237) 0%, rgb(124, 58, 237) ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{currentSong ? formatTime(duration || currentSong.duration) : '0:00'}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="px-4 py-6 space-y-4 border-t border-purple-500/20 backdrop-blur-xl bg-black/30 rounded-t-2xl">
            {/* Like Button */}
            {currentSong && (
              <button
                onClick={() => toggleLike(currentSong.id)}
                className="flex items-center justify-center w-full py-3 transition-all border rounded-lg bg-white/5 hover:bg-white/10 border-purple-500/20 hover:border-purple-500/40 group"
              >
                <Heart
                  className={`w-6 h-6 transition-all ${
                    currentSong.liked ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-purple-400'
                  }`}
                />
              </button>
            )}

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={playPrevious} 
                className="p-3 transition-all border border-transparent rounded-full hover:bg-white/10 hover:border-purple-500/30" 
                aria-label="Previous"
              >
                <SkipBack className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 text-white transition-all border-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-110 active:scale-95 border-purple-400/50"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="fill-current w-7 h-7" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-0.5" />
                )}
              </button>

              <button 
                onClick={playNext} 
                className="p-3 transition-all border border-transparent rounded-full hover:bg-white/10 hover:border-purple-500/30" 
                aria-label="Next"
              >
                <SkipForward className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 px-4 py-3 border rounded-lg bg-white/5 border-purple-500/20">
              {volume === 0 ? (
                <VolumeX className="w-5 h-5 text-gray-400" />
              ) : volume < 50 ? (
                <Volume1 className="w-5 h-5 text-gray-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-purple-400" />
              )}
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                style={{
                  background: `linear-gradient(to right, rgb(124, 58, 237) 0%, rgb(124, 58, 237) ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <span className="w-8 text-xs text-right text-gray-400">{volume}%</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Playlist */}
        <div className="flex-col hidden overflow-hidden border-l lg:flex lg:w-3/5 sidebar-right border-purple-500/20">
          <div className="px-8 py-6 border-b border-purple-500/20 backdrop-blur-xl bg-black/30">
            <h3 className="text-2xl font-black text-white">Playlist</h3>
            <p className="mt-1 text-sm text-gray-500">{playlist.length} songs</p>
          </div>

          <div className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              {playlist.map((songId, index) => {
                const song = songs.find(s => s.id === songId)
                if (!song) return null

                const isCurrentSong = song.id === currentSong?.id
                return (
                  <button
                    key={songId}
                    onClick={() => handleSelectSong(songId)}
                    className={`w-full text-left p-4 rounded-lg transition-all group relative overflow-hidden ${
                      isCurrentSong
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/20 border-2 border-purple-500/60 shadow-lg shadow-purple-500/30'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-purple-500/30'
                    }`}
                  >
                    {/* Glow effect for current song */}
                    {isCurrentSong && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent animate-pulse" />
                    )}
                    
                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <div className="flex items-center flex-1 min-w-0 gap-4">
                        <span className={`text-sm font-semibold flex-shrink-0 w-6 text-center ${isCurrentSong ? 'text-purple-400' : 'text-gray-600'}`}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold truncate ${isCurrentSong ? 'text-purple-300' : 'text-white'}`}>
                            {song.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                        </div>
                      </div>

                      {/* Animated equalizer for playing track */}
                      {isCurrentSong && isPlaying && (
                        <div className="flex gap-0.5 items-end h-4 mr-2">
                          {[8, 12, 10, 14, 9, 11].map((h, i) => (
                            <div
                              key={i}
                              className="w-0.5 bg-purple-400 rounded-full"
                              style={{ 
                                height: `${h}px`, 
                                animation: `equalizer ${0.3 + i * 0.1}s ease-in-out infinite`,
                                animationDelay: `${i * 0.05}s`
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Heart Icon */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLike(song.id)
                        }}
                        className="p-2 transition-opacity opacity-0 cursor-pointer group-hover:opacity-100 hover:scale-110"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            song.liked 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-500 hover:text-purple-400'
                          }`}
                        />
                      </div>

                      <span className="text-xs text-gray-600">{formatTime(song.duration)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
