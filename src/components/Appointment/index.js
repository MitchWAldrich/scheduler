import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error"
import useVisualMode from "hooks/useVisualMode";



export default function Appointment(props) {
  const { id, time, interview, interviewers } = props;
  
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETE = 'DELETE';
  const CONFIRM = 'CONFIRM';
  const EDIT = 'EDIT';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const onEdit = () => {
    transition(EDIT)
  }

  const onSave = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);
    
    props
      .bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
  }

  const onCancel = () => {
    transition(CONFIRM)
  } 

  const onDelete = (event) => {
    transition(DELETE, true);

    props
      .cancelInterview(id)
      .then(() => transition(EMPTY)) 
      .catch(() => transition(ERROR_DELETE, true))
  }

  
  
  return (
  <article className="appointment">
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