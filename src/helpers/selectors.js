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
  const interviewerID = interview.interviewer
  
  for (let appt in state.appointments) {
    let interviewObj = state.appointments[appt].interview
    let interviewerObj = {};

    if (!state.appointments[appt].interview) {
      continue
    } else if (state.appointments[appt].interview.interviewer === interviewerID && interview.student === state.appointments[appt].interview.student) {
      
      for (let interviewer in state.interviewers) {
        if (state.interviewers[interviewer].id === interviewerID) {
          interviewerObj = state.interviewers[interviewer]
        }
      }
      
      interviewObj = {...interviewObj, interviewer: interviewerObj}
      return interviewObj
    }
  }
}

// export function getInterview(state, interview) {
//   if (interview === null) {
//     return null;
//   }
//   const interviewerID = interview.interviewer;
  
//   for (let appt in state.appointments) {
    
    

//       for (let interview in state.appointments[appt].interview) {
//         if (interviewerID === state.appointments[appt].interview[interview]) {
//           let interviewObj = state.appointments[appt].interview;
       
//           let interviewerName = state.appointments[appt].interview.interviewer;

//           for (let name in state.interviewers) {
//             if (state.interviewers[name].id === interviewerName) {
//               interviewerName = state.interviewers[name];
//             }
//           }
//           interviewObj = { ...interviewObj, interviewer: interviewerName }
         
//           return interviewObj;
//         }
//       }
//     }
  
// }

export function getInterviewersForDay(state, day) {
  const interviewers = [];
  const filteredDay = state.days.filter(item => item.name === day);

  if (state.days.length === 0 || filteredDay.length === 0) {
    return [];
  }
 
  const daysInterviewers = filteredDay[0].interviewers;
  for (let elem of daysInterviewers) {

    for (let item in state.interviewers) {
     
      if (elem === state.interviewers[item].id) {
        interviewers.push(state.interviewers[item])
      }
    }
  }

  return interviewers;
}

