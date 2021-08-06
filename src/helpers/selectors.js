export function getAppointmentsForDay(state, day) {
  const appointments = [];
  const filteredDay = state.days.filter(item => item.name === day);
 
  if (state.days.length === 0 || filteredDay.length === 0) {
    return [];
  }
 
  const daysAppointments = filteredDay[0].appointments;

  for (let appt of daysAppointments) {
    
    for (let item in state.appointments) {
     
      if (appt === state.appointments[item].id) {
        appointments.push(state.appointments[item])
      }
    }
  }

  return appointments;
}

export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }
  const interviewerID = interview.interviewer;
  
  for (let appt in state.appointments) {
    
    for (let interviewer in state.interviewers) {

      for (let interview in state.appointments[appt].interview) {
        if (interviewerID === state.appointments[appt].interview[interview]) {
          let interviewObj = state.appointments[appt].interview;
          interviewObj = { ...interviewObj, interviewer: state.interviewers[interviewer] }
          return interviewObj;
        }
      }
    }
  }
}

