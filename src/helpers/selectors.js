export function getAppointmentsForDay(state, day) {//retrieve available appointments for a given day
  const appointments = [];
  const filteredDay = state.days.filter(item => item.name === day);//filter day from args
 
  if (state.days.length === 0 || filteredDay.length === 0) {
    return [];//if no day given, return an empty array
  }
 
  const daysAppointments = filteredDay[0].appointments;

  for (let appt of daysAppointments) {
    
    for (let item in state.appointments) {
     
      if (appt === state.appointments[item].id) { //if appointment matches the appointment id, add to the appointments array
        appointments.push(state.appointments[item])
      }
    }
  }
  
  return appointments; //return updated appointments array
}

//return formatted Interview Object for rendering
export function getInterview(state, interview) {
  if (interview === null) { //if no interview, return null 
    return null;
  }
  const interviewerID = interview.interviewer //get interviewer ID from interview object
  
  for (let appt in state.appointments) {//loop through appointments
    let interviewObj = state.appointments[appt].interview //interview object at given appointment
    let interviewerObj = {};

    if (!state.appointments[appt].interview) {//if interview is null, continue to loop
      continue
    } else if (state.appointments[appt].interview.interviewer === interviewerID && interview.student === state.appointments[appt].interview.student) {//if student and interviewer match
      
      for (let interviewer in state.interviewers) {
        if (state.interviewers[interviewer].id === interviewerID) {
          interviewerObj = state.interviewers[interviewer]//update the interviewer object
        }
      }
      
      interviewObj = {...interviewObj, interviewer: interviewerObj}//spread the updated interviewer into the state object
      return interviewObj//return updated state object
    }
  }
}

//retrieve interviewers available on a given day
export function getInterviewersForDay(state, day) {
  const interviewers = [];
  const filteredDay = state.days.filter(item => item.name === day);//find day in state from args

  if (state.days.length === 0 || filteredDay.length === 0) {
    return [];//if not day given, return an empty array
  }
 
  const daysInterviewers = filteredDay[0].interviewers;
  for (let elem of daysInterviewers) {

    for (let item in state.interviewers) {
     
      if (elem === state.interviewers[item].id) {//if interviewer id from state matches interviewer for a given day
        interviewers.push(state.interviewers[item])//add interviewer to array
      }
    }
  }

  return interviewers;//return updated interviewers array
}

