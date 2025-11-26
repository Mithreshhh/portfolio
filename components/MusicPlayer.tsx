'use client'

import { useState } from 'react'
import { Music, Volume2, VolumeX } from 'lucide-react'

interface MusicPlayerProps {
  youtubeVideoId: string
  songTitle?: string
  artist?: string
}

export function MusicPlayer({ 
  youtubeVideoId,
  songTitle = "Line Without a Hook", 
  artist = "Ricky Montgomery" 
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="music-player-container fixed bottom-8 right-8 z-50 group">
      {/* Hidden YouTube iframe for audio */}
      {isPlaying && (
        <iframe
          width="0"
          height="0"
          style={{ border: 0, display: 'block', position: 'absolute', opacity: 0 }}
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&loop=1&playlist=${youtubeVideoId}&controls=0&rel=0&showinfo=0${isMuted ? '&mute=1' : ''}`}
          allow="autoplay; encrypted-media"
          frameBorder="0"
          allowFullScreen
        />
      )}

      {/* Main music button */}
      <button
        onClick={togglePlay}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-105"
        aria-label={isPlaying ? 'Stop music' : 'Play music'}
      >
        {/* Animated rings when playing */}
        {isPlaying && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
          </>
        )}
        
        <Music className={`w-6 h-6 text-white relative z-10 transition-transform ${isPlaying ? 'scale-110' : ''}`} />
      </button>

      {/* Expanded info panel on hover */}
      {isPlaying && (
        <div className="absolute bottom-full right-0 mb-4 bg-card/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-border min-w-[250px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground">{songTitle}</p>
            <p className="text-xs text-muted-foreground">{artist}</p>
          </div>

          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-sm">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">Mute</span>
              </>
            )}
          </button>

          {/* Visual indicator */}
          <div className="flex items-center justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-primary to-secondary rounded-full"
                style={{
                  height: '16px',
                  animation: `musicBars 0.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes musicBars {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}

