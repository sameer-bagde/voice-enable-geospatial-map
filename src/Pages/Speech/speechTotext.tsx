/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import MicOn from '../../assets/images/icons8-mic-96.png';
import MicOff from '../../assets/images/icons8-mic-off-96.png';
import SearchBar from '../Search/searchBar';

interface SpeechToTextProps {
  onSearch: (searchTerm: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onSearch }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRecognitionRunning = useRef<boolean>(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      isRecognitionRunning.current = true;
    };

    recognition.onend = () => {
      isRecognitionRunning.current = false;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = transcriptText;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setTranscript('');
        }, 3000);

        onSearch(finalTranscript); // Update the map view with the search term
      }
    };

    recognition.onerror = (event: Event) => {
      const errorEvent = event as any;
      console.error('Speech Recognition Error:', errorEvent.error);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onSearch]);

  const handleStartStopListening = () => {
    setIsListening((prev) => !prev);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <SearchBar 
          isListening={isListening} 
          onMicClick={handleStartStopListening} 
          micIcon={isListening ? MicOn : MicOff} 
          onSearch={onSearch}
        />
      </div>

      {transcript && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: 'auto',
          maxWidth: '90%',
          zIndex: 1000,
          minWidth: '200px',
          textAlign: 'center',
        }}>
          <p style={{ color: '#4A4A4A' }}>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
