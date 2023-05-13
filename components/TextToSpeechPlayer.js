import React, { useState, useEffect, useRef } from 'react'
import { FiPauseCircle, FiPlayCircle, FiRepeat, FiRewind } from 'react-icons/fi'

const TextToSpeechPlayer = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)
  const [utteranceQueue, setUtteranceQueue] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const utterances = []
      const regex = /.{1,100}(,|\.|$)|.{1,100}/g
      const chunks = text.match(regex)
      console.log(chunks)
      chunks.forEach((chunk) => {
        const utterance = new SpeechSynthesisUtterance(chunk)
        utterance.lang = 'de-DE'
        const voices = window.speechSynthesis.getVoices()
        const selectedVoice = voices.find((voice) => voice.lang === 'de-DE')
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
        utterances.push(utterance)
      })

      setUtteranceQueue(utterances)
    }
  }, [text])

  const speakNextChunk = () => {
    window.speechSynthesis.cancel()
    console.log(`length: ${utteranceQueue.length}`)
    if (utteranceQueue.length === 0) {
      setIsPlaying(false)
      setIsPaused(false)
      return
    }

    const utterance = utteranceQueue.shift()
    utterance.rate = 0.8
    utterance.pitch = 1

    utterance.onend = speakNextChunk
    console.log(`play`, utterance)
    window.speechSynthesis.speak(utterance)
  }

  const handlePlayPause = () => {
    if (!isPlaying && !isPaused) {
      setIsPlaying(true)
      speakNextChunk()
    } else if (isPaused) {
      setIsPaused(false)
      window.speechSynthesis.resume()
    } else {
      setIsPaused(true)
      window.speechSynthesis.pause()
    }
  }

  const handleRestart = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setUtteranceQueue([])
    setIsRestarting(true)
  }

  useEffect(() => {
    if ((isRepeating || isRestarting) && !isPlaying && !isPaused) {
      handlePlayPause()
      if (isRestarting) setIsRestarting(false)
    }
  }, [isPlaying, isPaused, isRepeating, isRestarting])

  return (
    <div className="flex items-center justify-center space-x-4 rounded-lg bg-green-200 p-4 shadow-lg hover:shadow-xl">
      <button onClick={handleRestart} className="rounded-full p-2 hover:bg-green-300 hover:text-white">
        <FiRewind size={24} />
      </button>
      <button onClick={handlePlayPause} className="rounded-full p-2 hover:bg-green-300 hover:text-white">
        {isPlaying ? <FiPauseCircle size={24} /> : <FiPlayCircle size={24} />}
      </button>
      <button onClick={() => setIsRepeating(!isRepeating)} className="rounded-full p-2 hover:bg-green-300 hover:text-white">
        <FiRepeat size={24} className={` ${isRepeating && 'rounded-full text-green-600 hover:text-white'}`} />
      </button>
    </div>
  )
}

export default TextToSpeechPlayer
