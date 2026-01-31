'use client'

import { Song } from '@/types'
import { Heart, Music } from 'lucide-react'

interface PlaylistPanelProps {
  songs: Song[]
  playlist: string[]
  currentSongId?: string
  onSelectSong: (songId: string) => void
  onToggleLike: (songId: string) => void
}

export default function PlaylistPanel({
  songs,
  playlist,
  currentSongId,
  onSelectSong,
  onToggleLike,
}: PlaylistPanelProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-2xl font-bold text-foreground">Queue</h3>
        <p className="text-muted-foreground text-sm mt-1">
          {playlist.length} songs
        </p>
      </div>

      <div className="overflow-y-auto max-h-96">
        {playlist.map((songId, index) => {
          const song = songs.find(s => s.id === songId)
          if (!song) return null

          const isCurrentSong = currentSongId === songId

          return (
            <div
              key={songId}
              onClick={() => onSelectSong(songId)}
              className={`
                p-4 border-b border-border cursor-pointer transition-colors
                ${isCurrentSong ? 'bg-primary bg-opacity-20' : 'hover:bg-secondary'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
                  {isCurrentSong ? (
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-primary-foreground rounded-full animate-pulse"
                          style={{
                            height: `${8 + i * 3}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Music className="w-5 h-5 text-primary-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold truncate ${
                      isCurrentSong ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {index + 1}. {song.title}
                  </p>
                  <p className="text-muted-foreground text-sm truncate">
                    {song.artist}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {formatTime(song.duration)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleLike(songId)
                    }}
                    className="p-1.5 hover:bg-secondary rounded transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        song.liked ? 'fill-primary text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
