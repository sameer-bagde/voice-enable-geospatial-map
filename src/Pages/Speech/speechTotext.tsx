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
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('SpeechRecognition API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      console.log('Speech recognition started.');
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
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

        // Reset the 5-minute idle timer whenever speech is detected
        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current);
        }
        idleTimeoutRef.current = setTimeout(() => {
          setIsListening(false);  // Stop listening after 5 minutes of no speech
        }, 300000); // 5 minutes = 300,000 milliseconds

        // Clear transcript after 3 seconds of inactivity
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setTranscript('');
        }, 3000);
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
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      recognitionRef.current?.start();

      // Start the 5-minute idle timer when the microphone starts listening
      idleTimeoutRef.current = setTimeout(() => {
        setIsListening(false);  // Stop listening after 5 minutes of no speech
      }, 300000); // 5 minutes = 300,000 milliseconds
    } else {
      recognitionRef.current?.stop();
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    }
  }, [isListening]);

  const handleStartStopListening = () => {
    setIsListening((prev) => !prev);
  };

  const handleSearchInput = (searchTerm: string) => {
    // Call onSearch for search input
    onSearch(searchTerm);
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
          onSearch={handleSearchInput}
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
