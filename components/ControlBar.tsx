'use client'

import { Song } from '@/types'
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, Volume } from 'lucide-react'

interface ControlBarProps {
  currentSong?: Song
  isPlaying: boolean
  progress: number
  volume: number
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onProgressChange: (progress: number) => void
  onVolumeChange: (volume: number) => void
}

export default function ControlBar({
  currentSong,
  isPlaying,
  progress,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onProgressChange,
  onVolumeChange,
}: ControlBarProps) {
  return (
    <div className="bg-secondary border-t border-border">
      {/* Progress Bar */}
      <div className="px-6 pt-4 flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-8">
          {formatTime(currentSong?.duration ? (progress / 100) * currentSong.duration : 0)}
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => onProgressChange(Number(e.target.value))}
          className="flex-1 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {currentSong ? formatTime(currentSong.duration) : '0:00'}
        </span>
      </div>

      {/* Controls */}
      <div className="px-6 py-6 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {currentSong ? (
            <div>
              <p className="font-semibold text-foreground truncate text-sm">
                {currentSong.title}
              </p>
              <p className="text-muted-foreground text-xs truncate">
                {currentSong.artist}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Select a song to play</p>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onPrevious}
            className="p-2 hover:bg-primary hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Previous"
          >
            <SkipBack className="w-5 h-5 text-foreground" />
          </button>

          <button
            onClick={onPlayPause}
            className="p-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-2 hover:bg-primary hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Next"
          >
            <SkipForward className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-shrink-0 w-32">
          <VolumeIcon volume={volume} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-20 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
    </div>
  )
}

function VolumeIcon({ volume }: { volume: number }) {
  if (volume === 0) {
    return <Volume className="w-4 h-4 text-muted-foreground" />
  }
  if (volume < 50) {
    return <Volume1 className="w-4 h-4 text-muted-foreground" />
  }
  return <Volume2 className="w-4 h-4 text-muted-foreground" />
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
