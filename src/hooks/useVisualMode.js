import { useState } from 'react';

//function to update form mode (empty, create, show, error, status, delete)
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial); //set mode to state
  const [history, setHistory] = useState([initial]); //set mode history array to state

  const transition = (newMode, replace = false) => {//moves forward a mode
    setMode(newMode);//set given mode
    if (replace) {
    setHistory(prev => ([...prev]));//if the mode needs to be skipped if moving backwards (ie if on an error, after closing the error, skip over the deleting status screen), replace is triggered
    } else {
    setHistory(prev => ([...prev, newMode]));//update history with new mode
    }
  }

  const back = () => {//goes backwards one mode
    if (history.length > 1) {//limits mode from going below the history stack
    history.pop();//remove last mode from the history stack
    setHistory(history);//update history
    setMode(history[history.length-1]);//render top of history stack
    } 
  }

  return { mode, transition, back };
}