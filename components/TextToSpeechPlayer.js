import React, { useState, useEffect } from 'react'
import { FiRewind, FiPlayCircle, FiPauseCircle, FiRepeat, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const TextToSpeechPlayer = ({ text, translation = '', mp3File }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(-1)
  const [showTranslation, setShowTranslation] = useState(false)
  const [audioElement, setAudioElement] = useState(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [sentenceTimes, setSentenceTimes] = useState([])
  const [audioDuration, setAudioDuration] = useState(0)

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
  const sentencesHTML = text.split('. ')
  const sentences = text.replace(/\*\*/g, '').split('. ')
  const parsedTranslation = translation.replace(/\*\*(.*?)\*\*/g, '<code>$1</code>')

  // Calculate approximate time stamps for each sentence when audio duration changes
  useEffect(() => {
    if (audioDuration > 0) {
      const timePerSentence = audioDuration / sentences.length
      const times = sentences.map((_, index) => timePerSentence * index)
      setSentenceTimes(times)
    }
  }, [audioDuration, sentences.length])

  useEffect(() => {
    // Initialize audio element when mp3File changes and we're in the browser
    if (typeof window !== 'undefined' && mp3File) {
      const audio = new Audio()
      audio.preload = 'auto'

      // Add loading event listeners for debugging
      audio.addEventListener('loadeddata', () => {
        setAudioDuration(audio.duration)
      })
      audio.addEventListener('error', (e) => console.error('Audio loading error:', audio.error))

      // Set up event listeners for playback state
      audio.onplay = () => {
        setIsPlaying(true)
      }

      audio.onpause = () => {
        setIsPlaying(false)
      }

      audio.onended = () => {
        setIsPlaying(false)
        setCurrentSentence(-1)
      }

      // Add timeupdate listener to update current sentence
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          const currentTime = audio.currentTime
          const progress = currentTime / audio.duration
          const sentenceIndex = Math.floor(progress * sentences.length)

          // Only update if we have a valid sentence index and it's different from current
          if (sentenceIndex >= 0 && sentenceIndex < sentences.length && sentenceIndex !== currentSentence) {
            setCurrentSentence(sentenceIndex)
          }
        }
      })

      // Set the source and initial playback rate
      audio.src = mp3File
      audio.playbackRate = playbackSpeed
      setAudioElement(audio)

      // Set up error event listener
      audio.onerror = (err) => {
        console.error('Audio error:', {
          code: audio.error?.code,
          message: audio.error?.message,
          networkState: audio.networkState,
          readyState: audio.readyState,
        })
        setIsPlaying(false)
      }
    }

    // Cleanup function
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ''
        audioElement.load()
        setAudioElement(null)
      }
    }
  }, [mp3File])

  // Update audio event handlers when repeat state changes
  useEffect(() => {
    if (audioElement) {
      audioElement.onended = async () => {
        if (isRepeating) {
          audioElement.currentTime = 0
          setCurrentSentence(0)
          try {
            await audioElement.play()
            setIsPlaying(true)
          } catch (error) {
            console.error('[onended] Error replaying audio:', error)
            setIsPlaying(false)
            setCurrentSentence(-1)
          }
        } else {
          setIsPlaying(false)
          setCurrentSentence(-1)
        }
      }
    }
  }, [isRepeating, audioElement])

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation)
  }

  const handlePlay = (index) => {
    if (mp3File && audioElement) {
      try {
        if (typeof index === 'number' && index >= 0 && index < sentences.length) {
          // Calculate the time to jump to based on sentence index
          const progress = index / sentences.length
          audioElement.currentTime = progress * audioElement.duration
          setCurrentSentence(index)
        } else {
          // If no index provided or invalid, start from beginning
          audioElement.currentTime = 0
          setCurrentSentence(0)
        }

        audioElement
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.error('Error playing audio:', error)
            setIsPlaying(false)
            setCurrentSentence(-1)
          })
        setIsPaused(false)
      } catch (error) {
        console.error('Unexpected error during play:', error)
        setCurrentSentence(-1)
      }
    } else {
      const utterance = new SpeechSynthesisUtterance(sentences[index])
      utterance.lang = 'de-DE'
      utterance.onstart = () => {
        setCurrentSentence(index)
        setIsPlaying(true)
      }
      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentSentence(-1)
        if (isRepeating || index < sentences.length - 1) {
          handlePlay(isRepeating ? index : index + 1)
        }
      }

      const voices = window.speechSynthesis.getVoices()
      const selectedVoice = voices.find((voice) => voice.lang === 'de-DE')
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      window.speechSynthesis.cancel()

      window.speechSynthesis.speak(utterance)
    }
  }

  const handlePause = () => {
    if (audioElement) {
      audioElement.pause()
      setCurrentSentence(-1) // Remove highlighting when paused
    } else {
      window.speechSynthesis.pause()
    }
    setIsPaused(true)
    setIsPlaying(false)
  }

  const handleResume = () => {
    if (audioElement) {
      // If at the end, start from beginning
      if (audioElement.ended) {
        audioElement.currentTime = 0
        setCurrentSentence(0)
      }
      audioElement.play()
    } else {
      window.speechSynthesis.resume()
    }
    setIsPaused(false)
    setIsPlaying(true)
  }

  const handlePlayPause = () => {
    if (!isPlaying && !isPaused) {
      // If starting fresh or ended, start from beginning
      if (audioElement && (audioElement.ended || audioElement.currentTime === 0)) {
        audioElement.currentTime = 0
        setCurrentSentence(0)
      }
      handlePlay(0)
    } else if (isPaused) {
      handleResume()
    } else {
      handlePause()
    }
  }

  const handleRepeat = () => {
    const newRepeatState = !isRepeating
    setIsRepeating(newRepeatState)
  }

  const handleRestart = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      setCurrentSentence(0)
      setIsPlaying(false)
      setIsPaused(false)
      handlePlay(0)
    } else {
      window.speechSynthesis.cancel()
      setCurrentSentence(0)
      setIsPlaying(false)
      setIsPaused(false)
      handlePlay(0)
    }
  }

  return (
    <div className="max-w-8xl mx-auto space-y-4 p-0">
      {/* Text Content */}
      <p className="text-lg leading-relaxed">
        {sentences.map((sentence, index) => {
          const parsedSentence = sentence.replace(/\*\*(.*?)\*\*/g, '<code>$1</code>')
          return (
            <span
              key={index}
              className={`
                cursor-pointer 
                rounded
                px-0.5
                transition-all duration-300 ease-in-out
                ${index === currentSentence ? 'bg-primary-100 ring-1 ring-primary-300 dark:bg-primary-900 dark:ring-primary-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
              onClick={() => {
                if (mp3File && audioElement) {
                  handlePlay(index)
                }
              }}
              dangerouslySetInnerHTML={{
                __html: parsedSentence + (index < sentences.length - 1 ? '. ' : ''),
              }}
            />
          )
        })}
      </p>

      {/* Translation Panel */}
      {showTranslation && <div className="border-l-2 border-primary-500 bg-gray-50 py-1 pl-2 text-lg italic dark:bg-gray-800" dangerouslySetInnerHTML={{ __html: parsedTranslation }} />}

      {/* Compact Audio Controls */}
      <div className="flex flex-col gap-2">
        <div
          className="
          flex items-center 
          justify-between
          rounded-lg
          border
          border-gray-200 bg-white
          p-2
          shadow dark:border-gray-700 dark:bg-gray-800
        "
        >
          {/* Main Controls Group */}
          <div className="flex items-center gap-2">
            <button onClick={handleRestart} className="rounded-full p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
              <FiRewind className="h-4 w-4" />
            </button>

            <button
              onClick={handlePlayPause}
              className="
                rounded-full
                bg-primary-500
                p-2
                text-white
                hover:bg-primary-600
              "
            >
              {isPlaying ? <FiPauseCircle className="h-6 w-6" /> : <FiPlayCircle className="h-6 w-6" />}
            </button>

            <button
              onClick={handleRepeat}
              className={`
                rounded-full
                p-1.5
                ${isRepeating ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
              `}
            >
              <FiRepeat className="h-4 w-4" />
            </button>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {mp3File && (
              <select
                value={playbackSpeed}
                onChange={(e) => {
                  const newSpeed = parseFloat(e.target.value)
                  setPlaybackSpeed(newSpeed)
                  if (audioElement) {
                    audioElement.playbackRate = newSpeed
                  }
                }}
                className="
                  rounded border
                  border-gray-200
                  bg-white
                  px-2 py-1 text-xs
                  focus:outline-none focus:ring-1
                  focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900
                "
              >
                {speedOptions.map((speed) => (
                  <option key={speed} value={speed}>
                    {speed}x
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={toggleTranslation}
              className="
                rounded-full
                p-1.5
                text-gray-600 hover:bg-gray-100
                dark:text-gray-400 dark:hover:bg-gray-700
              "
            >
              {showTranslation ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextToSpeechPlayer
