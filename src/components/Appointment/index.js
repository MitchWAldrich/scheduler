//import React
import React from "react";

//import sass styling
import "components/Appointment/styles.scss";

//import Appointment components
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error"

//import function to manage form mode changes
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const { id, time, interview, interviewers } = props;
  
  //Variables to assign Form modes for rendering
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETE = 'DELETE';
  const CONFIRM = 'CONFIRM';
  const EDIT = 'EDIT';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';
  
  //renders a completed or empty form depending on interview object being passed
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //render the Edit form mode
  const onEdit = () => {
    transition(EDIT)
  }

  //onSave function to update name and interviewer state
  const onSave = (name, interviewer) => {
    const interview = { 
      student: name,
      interviewer
    };
    transition(SAVING, true); //transition to SAVING form mode
    
    props
      .bookInterview(id, interview) //book an interview with a given id and interview object
      .then(() => transition(SHOW)) //transition to confirmed interview appointment
      .catch(() => transition(ERROR_SAVE, true)) //on error, render Error saving form
  }

  //onCancel function to transition to the Confirm Delete form mode to remove an appointment
  const onCancel = () => {
    transition(CONFIRM)
  } 

  //onDelete removes the interview from state 
  const onDelete = (event) => {
    transition(DELETE, true); //show Deleting form mode

    props
      .cancelInterview(id) //deletes interview object from state
      .then(() => transition(EMPTY)) //transition back to the empty form mode
      .catch(() => transition(ERROR_DELETE, true)) //on error, transition to error deleting form
  }
  
  return (
  <article className="appointment" data-testid="appointment">
    <Header time={time}/>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}
    {mode === SHOW && (
      <Show 
      student={interview.student} 
      interviewer={interview.interviewer}
      onDelete={onCancel}
      onEdit={onEdit} 
      />
      )}
    {mode === CREATE && (
      <Form 
      interviewers={interviewers}
      onCancel={() => back()} //EMPTY
      onSave={onSave}
      />
      )}
    {mode === SAVING && (<Status message="Saving..."/>)}
    {mode === DELETE && (<Status message="Deleting..."/>)}
    {mode === CONFIRM && (
      <Confirm
      message="Delete the appointment?" 
      onConfirm={() => transition(EMPTY)}
      onCancel={() => back()} //SHOW
      onDelete={onDelete}
      />)}
    {mode === EDIT && (
      <Form 
        interviewers={interviewers}
        onCancel={() => back()} //EMPTY
        onSave={onSave}
        name={props.interview.student}
        interviewer={props.interview.interviewer.id}
      />)}
    {mode === ERROR_SAVE && (
      <Error
        message="Could not save appointment"
        onClose={() => back()}
      />)}
    {mode === ERROR_DELETE && (
      <Error
        message="Could not delete appointment"
        onClose={() => back()}
      />)}
  </article>
  )
}