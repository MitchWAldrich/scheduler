import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    if (replace) {
      history.pop();
    }
    history.push(newMode);
    setHistory(history);
    setMode(history[history.length-1]);
    return mode;
  }
  const back = () => {
    if (history.length > 1) {
    history.pop();
    setHistory(history);
    setMode(history[history.length-1]);
    return mode;
    } else {
      return mode;
    }
  }
  

  return { mode, transition, back };
}