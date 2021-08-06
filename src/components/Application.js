import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Button.scss";
import "components/DayListItem.scss";
import "components/Application.scss";

// import Button from "./Button";
// import DayListItem from "./DayListItem";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay } from "helpers/selectors";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//     interview: {
//       student: "Frank Lloyd-Wright",
//       interviewer: {
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   },
//   {
//     id: 4,
//     time: "3pm",
//   },
//   {
//     id: 5,
//     time: "4pm",
//     interview: {
//       student: "Randall Grichuk",
//       interviewer: {
//         id: 3,
//         name: "Mildred Nazir",
//         avatar: "https://i.imgur.com/T2WwVfS.png",
//       }
//     }
//   }
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {}
  })
  
  
  // const state = { day: "Monday", days: [] };
  // setState({ ...state, day: "Tuesday" });

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));
  // const setAppointments = appointments => setState(prev => ({ ...prev, appointments }));
  // const setInterviewers = interviewers => setState(prev => ({ ...prev, interviewers }));
  
  
  // const [days, setDays] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      // .then((response) => {
        //   console.log(response.data)
        //   // setDays(response.data)
        // })
        // }, []),
        
        // useEffect(() => {
          axios.get('/api/appointments'),
      // .then((response) => {
        //   console.log(response.data);
        // })
        // }, []),
        
        // useEffect(() => {
          axios.get('/api/interviewers')
          // }, [])
        ]).then((all) => {
          console.log(all[0].data);
          console.log(all[1].data);
          console.log(all[2].data);
          
          const [days, appointments, interviewers] = all;
          setState(prev => ({...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}));
          
          console.log(days.data, appointments.data, interviewers.data);
        })}, []);
        console.log('state', state)
        // getAppointmentsForDay(state.appointments, state.day);
        const dailyAppointments = getAppointmentsForDay(state, state.day);
        const parsedAppointments = dailyAppointments.map(appointment => {
          return (
            <Appointment 
            key={appointment.id}
            time={appointment.time}
            interview={appointment.interview}
            // setAppointment={setAppointments}
            {...appointment}
            />)})
            console.log('parsedAppts', parsedAppointments)
        // const [day, setDay] = useState("Monday");
        
        
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
        <Appointment key="last" time="5pm" />
      </section>
    </main>
    
  );
}
