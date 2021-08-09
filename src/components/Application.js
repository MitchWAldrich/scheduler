import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Button.scss";
import "components/DayListItem.scss";
import "components/Application.scss";

// import Button from "./Button";
// import DayListItem from "./DayListItem";
import DayList from "./DayList";
import Appointment from "./Appointment";
// import Form from "./Appointment/Form";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {
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
    
    const bookInterview = (id, interview) => {
      console.log(id, interview);
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      // setState({...state, appointments});
      
      return axios.put(`/api/appointments/${id}`, appointment)
        .then((results) => {
          setState({...state, appointments});
          console.log(results)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const cancelInterview = (id) => {
      console.log(id);
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      console.log('appt', appointment)
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      console.log('appts', appointments)
      // setState({...state, appointments});

      return axios.delete(`/api/appointments/${id}`, appointment)
        .then((results) => {
          setState({...state, appointments});
          console.log(results)
        })
        .catch((err) => {
          console.log(err)
        })
    }


      
  const dailyInterviewers = getInterviewersForDay(state, state.day);
    
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const parsedAppointments = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
   
    
    return (
      <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
      interviewers={dailyInterviewers}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
      
      // {...appointment}
      />
      )
    })
    
 
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay} />

        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {parsedAppointments}
        {/* <Form 
    interviewers={dailyInterviewers}
  /> */}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
