import axios from "axios";
import { useState, useEffect } from "react";

export default function useApplicationData() {
  
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {} 
  })
  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      setState(prev => ({...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}));
    })}, []);
  
  const updateSpots = (state) => {
    const dayName = state.day;
    const days = state.days;
    const appointments = state.appointments;

    const dayObj = days.find(day => day.name === dayName);

    let spots = 0;
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if(!appointment.interview) {
        spots++;
      }
    }

    const newDay = {...dayObj, spots};

    const newDays = days.map( day => day.name === dayName ? newDay : day );

    const updatedState = {...state, days: newDays};

    return updatedState
  }
  
    

  const bookInterview = (id, interview) => {
    
    return axios.put(`/api/appointments/${id}`, {interview: {...interview}})
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        
        setState(updateSpots({...state, appointments}))
      })
      .catch((e) => {
        console.log(e)
        throw e
      })

  }
  
  
  const cancelInterview = (id) => {
    
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        setState(updateSpots({...state, appointments}))
      })
      .catch((e) => {
        throw e
      })
    
  }
  
  return { state, setDay, bookInterview, cancelInterview }
    
}
  // const updateSpots = () => {
  //   let monday = 0;
  //   let tuesday = 0;
  //   let wednesday = 0;
  //   let thursday = 0;
  //   let friday = 0;

  //   for (let appt in state.appointments) {

  //     if (state.appointments[appt].interview === null && state.appointments[appt].id <= 5) {
  //       monday += 1;
  //     }

  //     if (state.appointments[appt].interview === null && state.appointments[appt].id > 5 && state.appointments[appt].id <= 10) {
  //       tuesday += 1;
  //     }

  //     if (state.appointments[appt].interview === null && state.appointments[appt].id > 10 && state.appointments[appt].id <= 15) {
  //       wednesday += 1;
  //     }

  //     if (state.appointments[appt].interview === null && state.appointments[appt].id > 15 && state.appointments[appt].id <= 20) {
  //       thursday += 1;
  //     }

  //     if (state.appointments[appt].interview === null && state.appointments[appt].id > 20 && state.appointments[appt].id <= 25) {
  //       friday += 1;
  //     }
  //   }
    
  //   const dailySpots = {
  //     monday,
  //     tuesday,
  //     wednesday,
  //     thursday,
  //     friday
  //   }
    
  //   return dailySpots
  // }