/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';

const SpeechRecognition =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;

const recognition = new SpeechRecognition();

const App: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN';


    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  return (
    <div className="App">
      <h1>Web Speech API Example</h1>
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop Listening
      </button>
      <p>{transcript}</p>
    </div>
  );
};

export default App;
