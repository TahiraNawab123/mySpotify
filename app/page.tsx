'use client'

import { useState, useEffect, useRef } from 'react'
import { Music, Heart, Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from 'lucide-react'
import { Song } from '@/types'

const SAMPLE_SONGS: Song[] = [
  { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: 200, liked: false },
  { id: '2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 203, liked: false },
  { id: '3', title: 'Good as Hell', artist: 'Lizzo', album: 'Cuz I Love You', duration: 206, liked: false },
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
  const [volume, setVolume] = useState(70)
  const [songs, setSongs] = useState<Song[]>(SAMPLE_SONGS)
  const [playlist] = useState<string[]>(SAMPLE_SONGS.map(s => s.id))
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSong = songs.find(s => s.id === playlist[currentSongIndex])

  // Update progress & handle song end
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }

    const handleEnded = () => {
      setCurrentSongIndex(prev => (prev + 1) % playlist.length)
      setIsPlaying(true)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSongIndex, playlist])

  // Play/pause audio
  useEffect(() => {
    if (isPlaying) audioRef.current?.play().catch(() => {})
    else audioRef.current?.pause()
  }, [isPlaying])

  // Adjust volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100
  }, [volume])

  const playNext = () => {
    setCurrentSongIndex(prev => (prev + 1) % playlist.length)
    setIsPlaying(true)
  }

  const playPrevious = () => {
    setCurrentSongIndex(prev => (prev - 1 + playlist.length) % playlist.length)
    setIsPlaying(true)
  }

  const toggleLike = (songId: string) => {
    setSongs(songs.map(s => (s.id === songId ? { ...s, liked: !s.liked } : s)))
  }

  const handleProgressChange = (newProgress: number) => {
    if (audioRef.current?.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration
      setProgress(newProgress)
    }
  }

  const handleSelectSong = (songId: string) => {
    const index = playlist.indexOf(songId)
    if (index !== -1) {
      setCurrentSongIndex(index)
      setIsPlaying(true)
    }
  }

  const currentTime = currentSong?.duration ? (progress / 100) * currentSong.duration : 0

  return (
      <div className="min-h-screen relative overflow-hidden">
      <div className="disco-background" />
      <div className="disco-light disco-light-1" />
      <div className="disco-light disco-light-2" />
      <div className="disco-light disco-light-3" />
      <div className="disco-light disco-light-4" />
      
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-900/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-900/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Top Navigation */}
      <div className="relative z-20 border-b border-white/10 backdrop-blur-md bg-black/30">
        <div className="px-8 py-4">
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-black text-white tracking-tighter">
              <span className="text-primary">mini</span>Spotify
            </h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">Made by Tahira Nawab</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Left Panel - Now Playing */}
        <div className="w-full lg:w-2/5 flex flex-col border-r border-white/5 overflow-hidden px-8 py-6">
          {/* Song Info */}
          <div className="text-center mb-6">
            <h2 className="text-4xl font-black text-white mb-2 line-clamp-2">
              {currentSong?.title || 'No Song'}
            </h2>
            <p className="text-xl text-primary mb-1">{currentSong?.artist || 'Unknown'}</p>
            <p className="text-sm text-gray-500">{currentSong?.album || 'No Album'}</p>
          </div>

          {/* Album Art */}
          <div className="mb-8 w-full max-w-xs mx-auto">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="w-full h-full bg-gradient-to-br from-primary/40 via-purple-900/40 to-black flex items-center justify-center">
                <Music className="w-24 h-24 text-primary/50" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="flex gap-1.5 items-end h-16">
                      {[15, 24, 18, 22, 16].map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-primary rounded-full"
                          style={{ height: `${h}px`, animation: `pulse ${0.6 + i * 0.1}s ease-in-out infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary transition-all"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{currentSong ? formatTime(currentSong.duration) : '0:00'}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-white/5 backdrop-blur-md bg-black/30 px-4 py-6 space-y-4">
            {/* Like Button */}
            {currentSong && (
              <button
                onClick={() => toggleLike(currentSong.id)}
                className="w-full flex items-center justify-center py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <Heart
                  className={`w-6 h-6 transition-all ${
                    currentSong.liked ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-primary'
                  }`}
                />
              </button>
            )}

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button onClick={playPrevious} className="p-3 hover:bg-white/10 rounded-full transition-all" aria-label="Previous">
                <SkipBack className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 bg-primary text-black rounded-full hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-110 active:scale-95"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
              </button>

              <button onClick={playNext} className="p-3 hover:bg-white/10 rounded-full transition-all" aria-label="Next">
                <SkipForward className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
              {volume === 0 ? <VolumeX className="w-5 h-5 text-gray-400" /> : volume < 50 ? <Volume1 className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-primary" />}
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <span className="text-xs text-gray-400 w-8 text-right">{volume}%</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Playlist */}
        <div className="hidden lg:flex lg:w-3/5 flex-col border-l border-white/5 overflow-hidden">
          <div className="border-b border-white/5 backdrop-blur-md bg-black/30 px-8 py-6">
            <h3 className="text-2xl font-black text-white">Playlist</h3>
            <p className="text-sm text-gray-500 mt-1">{playlist.length} songs</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              {playlist.map((songId, index) => {
                const song = songs.find(s => s.id === songId)
                if (!song) return null

                const isCurrentSong = song.id === currentSong?.id
                return (
                  <button
                    key={songId}
                    onClick={() => handleSelectSong(songId)}
                    className={`w-full text-left p-4 rounded-lg transition-all group ${
                      isCurrentSong
                        ? 'bg-primary/20 border border-primary/50'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0 flex items-center gap-4">
                        <span className={`text-sm font-semibold flex-shrink-0 w-6 text-center ${isCurrentSong ? 'text-primary' : 'text-gray-600'}`}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold truncate ${isCurrentSong ? 'text-primary' : 'text-white'}`}>{song.title}</p>
                          <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                        </div>
                      </div>

                      {/* Heart Icon clickable div */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLike(song.id)
                        }}
                        className="p-2 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${song.liked ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-primary'}`}
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
