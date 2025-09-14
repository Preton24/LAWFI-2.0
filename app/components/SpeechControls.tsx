'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SpeechControlsProps {
  onSpeechRecognized: (text: string) => void;
  textToSpeak?: string; // Optional text to be spoken by TTS
  voiceLanguage?: string; // e.g., 'en-US'
}

export function SpeechControls({ onSpeechRecognized, textToSpeak, voiceLanguage = 'en-US' }: SpeechControlsProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false // Listen for single phrases
    recognition.interimResults = false // Only return final results
    recognition.lang = voiceLanguage

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('')
      onSpeechRecognized(transcript)
      setIsListening(false) // Stop listening after result
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false) // Ensure button state is updated
    }

    recognitionRef.current = recognition

    return () => {
      recognition.current?.stop()
    }
  }, [onSpeechRecognized, voiceLanguage])

  // Handle Text-to-Speech
  useEffect(() => {
    if (typeof window === 'undefined') return

    const synth = window.speechSynthesis
    if (!synth) {
      console.warn('Text-to-Speech not supported in this browser.')
      return
    }

    const speak = (text: string) => {
      if (!text.trim()) return

      // Cancel any ongoing speech
      synth.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = voiceLanguage
      utterance.rate = 1 // Normal speed
      utterance.pitch = 1 // Normal pitch

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (event) => {
        console.error('TTS error:', event.error)
        setIsSpeaking(false)
      }

      utteranceRef.current = utterance
      synth.speak(utterance)
    }

    if (textToSpeak && !isSpeaking) {
      speak(textToSpeak)
    }

    return () => {
      synth.cancel()
    }
  }, [textToSpeak, voiceLanguage, isSpeaking]) // Re-run when textToSpeak changes

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else if (textToSpeak) {
      // Re-trigger the TTS effect by updating the state or directly calling speak
      // For simplicity, we'll let the useEffect handle it for new `textToSpeak`
      // Or, if we want to re-speak the *same* textToSpeak, we need a manual trigger.
      // For now, assume `textToSpeak` changes to trigger it.
      // A more robust solution might pass a `speakText` function down.
      // For this example, if textToSpeak is already present, just ensure it plays.
      // If it's already speaking, the useEffect cleans it up and restarts with the same text.
      if (!window.speechSynthesis.speaking && textToSpeak) {
        const synth = window.speechSynthesis
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.lang = voiceLanguage
        utterance.rate = 1
        utterance.pitch = 1
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = (event) => {
          console.error('TTS error:', event.error)
          setIsSpeaking(false)
        }
        utteranceRef.current = utterance
        synth.speak(utterance)
      }
    }
  }


  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleListening}
        disabled={typeof window === 'undefined' || !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)}
        className={cn({ 'bg-primary text-primary-foreground': isListening })}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        <span className="sr-only">{isListening ? 'Stop Listening' : 'Start Listening'}</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleSpeaking}
        disabled={typeof window === 'undefined' || !('speechSynthesis' in window) || !textToSpeak}
        className={cn({ 'bg-primary text-primary-foreground': isSpeaking })}
      >
        {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        <span className="sr-only">{isSpeaking ? 'Stop Speaking' : 'Start Speaking'}</span>
      </Button>
    </div>
  )
}