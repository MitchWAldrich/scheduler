import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode) => {
    history.push(newMode)
    setHistory(history);
    setMode(history[history.length-1]);
    return mode
  }
  const back = () => {
    history.pop()
    setHistory(history)
    setMode(history[history.length-1])
    return mode
  }
  

  return { mode, transition, back };
}