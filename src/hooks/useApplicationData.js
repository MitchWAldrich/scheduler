import axios from "axios";
import { useState, useEffect } from "react";

//separation of concerns, control state from its own hook
export default function useApplicationData() {
  
  const [state, setState] = useState({//state object
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {} 
  })
  const setDay = day => setState({ ...state, day });//set Day state
  
  useEffect(() => {//make request to all api servers
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [days, appointments, interviewers] = all; //array destructure the promise responses
      setState(prev => ({...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}));//update state object
    })}, []);
  
  //totals number of available spots for rendering on the page  
  const updateSpots = (state) => {//takes in a state object
    //separates state into its keys: day, days, and appointments
    const dayName = state.day;
    const days = state.days;
    const appointments = state.appointments;

    const dayObj = days.find(day => day.name === dayName);//find specific day object

    let spots = 0;//spots initialized at 0
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if(!appointment.interview) {//for every empty interview (interview: null), increment available spots by 1
        spots++;
      }
    }

    const newDay = {...dayObj, spots};//spread new day

    const newDays = days.map( day => day.name === dayName ? newDay : day );//update days object replacing only the updated day

    const updatedState = {...state, days: newDays};//spread new days object in state

    return updatedState //return updated state object
  }
  
    
  //function to book a new interview appointment
  const bookInterview = (id, interview) => {
    
    return axios.put(`/api/appointments/${id}`, {interview: {...interview}})//add new interview to server
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }//update appointment with new interview
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment//update appointments object with individual appointment
        };
        
        setState(updateSpots({...state, appointments}))//update state while rendering updated number of available spots
      })
      .catch((e) => {//throw an error, if found
        throw e
      })

  }
  
  //function to cancel a booked interview
  const cancelInterview = (id) => {
    
    return axios.delete(`/api/appointments/${id}`)//delete request to server with given id
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: null //update interview object with null value, since empty
        };
        
        const appointments = {
          ...state.appointments,
          [id]: appointment //update appointments with new individual appointment
        };

        setState(updateSpots({...state, appointments})) //update state while rendering updated number of available interview spots
      })
      .catch((e) => {//throw an error if found
        throw e
      })
    
  }
  
  return { state, setDay, bookInterview, cancelInterview }
    
}
 