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
