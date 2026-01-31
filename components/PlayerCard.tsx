import { Song } from '@/types'
import { Music } from 'lucide-react'

interface PlayerCardProps {
  song?: Song
  isPlaying: boolean
}

export default function PlayerCard({ song, isPlaying }: PlayerCardProps) {
  return (
    <div className="sticky top-6">
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-2xl">
        {/* Album Art */}
        <div className="relative aspect-square bg-gradient-to-br from-primary to-accent flex items-center justify-center group">
          {song?.imageUrl ? (
            <img
              src={song.imageUrl || "/placeholder.svg"}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl">
              <Music className="w-24 h-24 text-primary-foreground opacity-50" />
            </div>
          )}
          
          {isPlaying && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${20 + i * 10}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="music-center p-6">
          <h2 className="text-xl font-bold text-foreground truncate">
            {song?.title || 'No song selected'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1 truncate">
            {song?.artist || 'Unknown artist'}
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            {song?.album || 'Unknown album'}
          </p>
          
          {song && (
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Duration: {formatTime(song.duration)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
