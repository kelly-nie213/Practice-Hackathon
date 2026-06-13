import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import * as Speech from 'expo-speech';

interface TTSContextValue {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
}

const TTSContext = createContext<TTSContextValue>({} as TTSContextValue);

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const queue = useRef<string[]>([]);
  const active = useRef(false);

  const processNext = useCallback(() => {
    if (queue.current.length === 0) {
      active.current = false;
      setIsSpeaking(false);
      return;
    }
    const text = queue.current.shift()!;
    active.current = true;
    setIsSpeaking(true);
    Speech.speak(text, {
      rate: 0.85,
      pitch: 1.0,
      onDone: processNext,
      onError: processNext,
    });
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (active.current) {
        // Stop current, clear queue, speak immediately
        Speech.stop();
        queue.current = [text];
        active.current = false;
        setTimeout(processNext, 150);
      } else {
        queue.current.push(text);
        processNext();
      }
    },
    [processNext]
  );

  const stop = useCallback(() => {
    Speech.stop();
    queue.current = [];
    active.current = false;
    setIsSpeaking(false);
  }, []);

  return <TTSContext.Provider value={{ speak, stop, isSpeaking }}>{children}</TTSContext.Provider>;
}

export function useTTS() {
  return useContext(TTSContext);
}
