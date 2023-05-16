import React, { useState, useEffect } from 'react'
import { FiPauseCircle, FiPlayCircle, FiRepeat, FiRewind } from 'react-icons/fi'

const TextToSpeechPlayer = ({ text, translation = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(-1)
  const [showTranslation, setShowTranslation] = useState(false)

  const sentencesHTML = text.split('. ')
  const sentences = text.replace(/\*\*/g, '').split('. ')
  const parsedTranslation = translation.replace(/\*\*(.*?)\*\*/g, '<code>$1</code>')

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation)
  }

  const handlePlay = (index) => {
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

  const handlePause = () => {
    window.speechSynthesis.pause()
    setIsPaused(true)
    setIsPlaying(false)
  }

  const handleResume = () => {
    window.speechSynthesis.resume()
    setIsPaused(false)
    setIsPlaying(true)
  }

  const handlePlayPause = () => {
    if (!isPlaying && !isPaused) {
      handlePlay(currentSentence)
    } else if (isPaused) {
      handleResume()
    } else {
      handlePause()
    }
  }

  const handleRepeat = () => {
    setIsRepeating(!isRepeating)
  }

  const handleRestart = () => {
    window.speechSynthesis.cancel()
    setCurrentSentence(0)
    setIsPlaying(false)
    setIsPaused(false)
    handlePlay(0)
  }

  return (
    <>
      <p>
        {sentencesHTML.map((sentence, index) => {
          const parsedSentence = sentence.replace(/\*\*(.*?)\*\*/g, '<code>$1</code>')
          return <span key={index} className={`${index === currentSentence ? 'bg-primary-200 dark:bg-primary-800' : ''}`} dangerouslySetInnerHTML={{ __html: parsedSentence + '. ' }}></span>
        })}
        {showTranslation && <p className="text-md mt-4 rounded-md bg-gray-100 p-2 italic" dangerouslySetInnerHTML={{ __html: parsedTranslation }} />}
      </p>

      <button onClick={toggleTranslation} className="my-4 rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600">
        Toggle Translation
      </button>

      <div className="flex items-center justify-center space-x-4 rounded-lg bg-primary-200 p-4 shadow-lg hover:shadow-xl dark:bg-primary-800">
        <button onClick={handleRestart} className="rounded-full p-2 hover:bg-primary-300 hover:text-white">
          <FiRewind size={24} />
        </button>
        <button onClick={handlePlayPause} className="rounded-full p-2 hover:bg-primary-300 hover:text-white">
          {isPlaying ? <FiPauseCircle size={24} /> : <FiPlayCircle size={24} />}
        </button>
        <button onClick={handleRepeat} className="rounded-full p-2 hover:bg-primary-300 hover:text-white">
          <FiRepeat size={24} className={` ${isRepeating ? 'rounded-full text-primary-600 hover:text-white' : ''}`} />
        </button>
      </div>
    </>
  )
}

export default TextToSpeechPlayer
