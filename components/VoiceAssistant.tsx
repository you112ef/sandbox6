'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, VolumeX, Settings, Play, Square } from 'lucide-react'

interface VoiceAssistantProps {
  className?: string
  onTranscript?: (text: string) => void
  onResponse?: (text: string) => void
}

export default function VoiceAssistant({ 
  className = '', 
  onTranscript,
  onResponse 
}: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [settings, setSettings] = useState({
    language: 'en-US',
    voice: 'default',
    speed: 1.0,
    pitch: 1.0
  })

  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    initializeVoiceFeatures()
    return () => {
      cleanup()
    }
  }, [])

  const initializeVoiceFeatures = () => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = settings.language

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setIsConnected(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        const currentTranscript = finalTranscript || interimTranscript
        setTranscript(currentTranscript)
        
        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setIsConnected(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize audio context for advanced audio processing
    if (typeof AudioContext !== 'undefined') {
      audioContextRef.current = new AudioContext()
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Failed to start speech recognition:', error)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = settings.speed
      utterance.pitch = settings.pitch
      utterance.volume = isMuted ? 0 : volume

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
        setIsSpeaking(false)
      }

      synthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleToggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleToggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else if (response) {
      speak(response)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (isSpeaking && synthesisRef.current) {
      synthesisRef.current.volume = isMuted ? 0 : newVolume
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
    if (isSpeaking && synthesisRef.current) {
      synthesisRef.current.volume = !isMuted ? 0 : volume
    }
  }

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (synthesisRef.current) {
      window.speechSynthesis.cancel()
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  const getAvailableVoices = () => {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices()
    }
    return []
  }

  const getVoiceSettings = () => {
    const voices = getAvailableVoices()
    return {
      voices: voices.map(voice => ({
        name: voice.name,
        lang: voice.lang,
        default: voice.default
      })),
      currentVoice: settings.voice,
      language: settings.language,
      speed: settings.speed,
      pitch: settings.pitch
    }
  }

  return (
    <div className={`bg-gray-800 border-l border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Assistant
          </h3>
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Voice Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleListening}
            className={`p-3 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            title={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleToggleSpeaking}
            disabled={!response}
            className={`p-3 rounded-full transition-colors ${
              isSpeaking 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isSpeaking ? 'Stop speaking' : 'Start speaking'}
          >
            {isSpeaking ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Transcript */}
      <div className="p-4 border-b border-gray-700">
        <h4 className="font-medium text-white mb-2">Transcript</h4>
        <div className="bg-gray-700 rounded-md p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
          {transcript ? (
            <p className="text-sm text-white">{transcript}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">Start speaking to see transcript...</p>
          )}
        </div>
      </div>

      {/* Response */}
      <div className="p-4 border-b border-gray-700">
        <h4 className="font-medium text-white mb-2">Response</h4>
        <div className="bg-gray-700 rounded-md p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
          {response ? (
            <p className="text-sm text-white">{response}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">AI response will appear here...</p>
          )}
        </div>
      </div>

      {/* Volume Control */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-white">Volume</h4>
          <button
            onClick={handleMuteToggle}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          disabled={isMuted}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>{Math.round(volume * 100)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4">
        <h4 className="font-medium text-white mb-3">Voice Settings</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="ja-JP">Japanese</option>
              <option value="ko-KR">Korean</option>
              <option value="zh-CN">Chinese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Speed</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.speed}
              onChange={(e) => setSettings({ ...settings, speed: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.5x</span>
              <span>{settings.speed}x</span>
              <span>2x</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Pitch</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.pitch}
              onChange={(e) => setSettings({ ...settings, pitch: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.5x</span>
              <span>{settings.pitch}x</span>
              <span>2x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}