import React, { useState, useRef, useEffect } from 'react'
import { IoPlay, IoPause, IoStop, IoPlaySkipBack, IoPlaySkipForward, IoVolumeHigh, IoSettings } from 'react-icons/io5'

/**
 * PlayAllAudios
 * Plays an array of audio file paths sequentially with Play All/Stop controls.
 * @param {string[]} audioPaths
 */
export default function PlayAllAudios({ audioPaths }) {
  const [currentIdx, setCurrentIdx] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showVolume, setShowVolume] = useState(false)
  const volumeRef = useRef(null)

  const audioRef = useRef(null)
  const lastPlayedIdx = useRef(null)

  // Track last played index to avoid resetting on resume
  useEffect(() => {
    if (!isPlaying || currentIdx === null) return
    if (!audioPaths || !audioPaths[currentIdx]) return
    const audio = audioRef.current
    if (!audio) return
    if (lastPlayedIdx.current !== currentIdx) {
      audio.src = audioPaths[currentIdx]
      audio.currentTime = 0
      lastPlayedIdx.current = currentIdx
    }
    audio.playbackRate = playbackRate
    audio.volume = volume
    audio.play()
    setIsPaused(false)
    console.log(`[PlayAllAudios] Playing audio #${currentIdx + 1}:`, audioPaths[currentIdx])
  }, [currentIdx, isPlaying, audioPaths, playbackRate, volume])

  // Handle audio end
  useEffect(() => {
    const handleEnded = () => {
      if (audioPaths && currentIdx !== null && currentIdx < audioPaths.length - 1) {
        setCurrentIdx(currentIdx + 1)
      } else {
        setIsPlaying(false)
        setCurrentIdx(null)
        console.log('[PlayAllAudios] Finished all audios')
      }
    }
    const el = audioRef.current
    if (el) el.addEventListener('ended', handleEnded)
    return () => {
      if (el) el.removeEventListener('ended', handleEnded)
    }
  }, [currentIdx, isPlaying, audioPaths])

  // Progress and duration tracking
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const updateProgress = () => setProgress(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || 0)
    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', updateDuration)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [currentIdx])

  const playAll = () => {
    if (audioPaths && audioPaths.length > 0) {
      setCurrentIdx(0)
      setIsPlaying(true)
      setIsPaused(false)
      console.log('[PlayAllAudios] Starting Play All:', audioPaths)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPaused(true)
      setIsPlaying(false)
      console.log('[PlayAllAudios] Paused playback')
    }
  }

  const resumeAudio = () => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
      audioRef.current.volume = volume
      audioRef.current.play()
      setIsPaused(false)
      setIsPlaying(true)
      console.log('[PlayAllAudios] Resumed playback')
    }
  }

  const stopAll = () => {
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentIdx(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    console.log('[PlayAllAudios] Stopped playback')
  }

  const changeSpeed = (rate) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const seek = (e) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.target.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = clickX / rect.width
    audio.currentTime = percent * duration
  }

  const playPrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const playNext = () => {
    if (audioPaths && currentIdx !== null && currentIdx < audioPaths.length - 1) setCurrentIdx(currentIdx + 1)
  }

  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Hide volume popover on outside click
  useEffect(() => {
    if (!showVolume) return
    function handleClick(e) {
      if (volumeRef.current && !volumeRef.current.contains(e.target)) {
        setShowVolume(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showVolume])

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!audioPaths || audioPaths.length === 0) return null

  return (
    <div className="mx-auto my-2 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      {/* Modern Header with gradient */}
      <div className="dark:to-gray-750 border-b border-yellow-100 bg-gradient-to-r from-yellow-50 to-yellow-100 px-4 py-3 dark:border-gray-700 dark:from-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
            <h2 className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">Kapitel Audio</h2>
          </div>
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-gray-700 dark:text-yellow-300">
            {isPlaying && currentIdx !== null ? `${currentIdx + 1}/${audioPaths.length}` : `${audioPaths.length} Chapters`}
          </span>
        </div>
      </div>

      {/* Sleek Player Body */}
      <div className="space-y-3 p-4">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="group relative h-1.5 cursor-pointer overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700" onClick={seek} role="slider" aria-label="Seek bar">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-200 dark:from-yellow-500 dark:to-yellow-400" style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }} />
            <div
              className="absolute left-0 top-0 h-3 w-3 -translate-y-1/4 transform rounded-full border-2 border-yellow-500 bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ left: `calc(${duration ? (progress / duration) * 100 : 0}% - 4px)` }}
            />
          </div>

          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Unified Controls Row */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <button
            className="rounded-full bg-gray-50 p-2 transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-yellow-700"
            onClick={playPrev}
            disabled={!isPlaying || currentIdx === 0}
            aria-label="Previous"
          >
            <IoPlaySkipBack className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Main Play/Pause Button */}
          {!isPlaying && !isPaused && (
            <button
              className="transform rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={playAll}
              aria-label="Play All"
            >
              <IoPlay className="h-5 w-5" />
            </button>
          )}
          {isPlaying && !isPaused && (
            <button
              className="transform rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={pauseAudio}
              aria-label="Pause"
            >
              <IoPause className="h-5 w-5" />
            </button>
          )}
          {isPaused && (
            <button
              className="transform rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={resumeAudio}
              aria-label="Resume"
            >
              <IoPlay className="h-5 w-5" />
            </button>
          )}

          <button
            className="rounded-full bg-gray-50 p-2 transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-yellow-700"
            onClick={stopAll}
            disabled={!isPlaying && !isPaused}
            aria-label="Stop"
          >
            <IoStop className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </button>

          <button
            className="rounded-full bg-gray-50 p-2 transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-yellow-700"
            onClick={playNext}
            disabled={!isPlaying || currentIdx === audioPaths.length - 1}
            aria-label="Next"
          >
            <IoPlaySkipForward className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Volume Widget */}
          <div className="relative flex items-center" ref={volumeRef}>
            <button
              className="flex items-center justify-center rounded-full p-2 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:hover:bg-yellow-900"
              aria-label="Volume"
              onClick={() => setShowVolume((v) => !v)}
              tabIndex={0}
              type="button"
            >
              <IoVolumeHigh className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
            </button>
            {showVolume && (
              <div className="animate-fade-in absolute bottom-10 left-1/2 z-20 ml-[-20px] flex w-10 flex-col items-center">
                <div className="flex flex-col items-center rounded-lg border border-yellow-100 bg-white px-2 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={changeVolume}
                    className="vertical-slider"
                    aria-label="Volume slider"
                    aria-valuenow={volume}
                    aria-valuemin={0}
                    aria-valuemax={1}
                    style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical', height: 60, width: 24 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1 dark:bg-gray-700">
            <IoSettings className="h-3.5 w-3.5 flex-shrink-0 text-yellow-500 dark:text-yellow-400" />
            <select
              value={playbackRate}
              onChange={(e) => changeSpeed(Number(e.target.value))}
              aria-label="Playback speed"
              className="rounded-md border-none bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              style={{ minWidth: 56 }}
            >
              {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <option key={rate} value={rate}>
                  {rate}x
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="auto" />

      <style jsx>{`
        .vertical-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6; /* yellow-500 */
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease;
          margin-top: -6px; /* vertically center */
          margin-left: 6px; /* horizontally center over 4px track */
        }

        .vertical-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
        }

        .vertical-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6; /* yellow-500 */
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease;
          margin-left: 6px;
        }

        .vertical-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }

        .vertical-slider::-webkit-slider-runnable-track {
          width: 4px;
          height: 100%;
          background: #e5e7eb;
          border-radius: 2px;
          margin-left: 10px;
        }
        .vertical-slider::-moz-range-track {
          width: 4px;
          height: 100%;
          background: #e5e7eb;
          border-radius: 2px;
          margin-left: 10px;
        }

        @media (max-width: 480px) {
          .max-w-md {
            max-width: 100%;
            margin: 0 0.5rem;
            border-radius: 0.5rem;
          }

          .flex-1.max-w-130px {
            max-width: 100px;
          }

          .gap-3 {
            gap: 0.5rem;
          }

          .p-4 {
            padding: 0.75rem;
          }

          .space-y-3 > * + * {
            margin-top: 0.5rem;
          }
        }

        @media (max-width: 360px) {
          .flex-wrap {
            flex-wrap: wrap;
          }

          .gap-3 {
            gap: 0.375rem;
          }

          .p-4 {
            padding: 0.625rem;
          }

          .max-w-130px {
            max-width: 100%;
            margin-bottom: 0.5rem;
          }

          .rounded-xl {
            border-radius: 0.5rem;
          }
        }
        .vertical-slider {
          writing-mode: bt-lr; /* vertical */
          -webkit-appearance: slider-vertical;
          width: 24px;
          height: 72px;
          background: transparent;
          margin: 0;
          padding: 0;
          display: block;
        }
        .animate-fade-in {
          animation: fadeIn 0.18s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
