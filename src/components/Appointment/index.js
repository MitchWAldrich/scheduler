import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import useVisualMode from "hooks/useVisualMode";



export default function Appointment(props) {
  const { id, time, interview, interviewers, bookInterview, cancelInterview } = props;
  
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETE = 'DELETE';
  const CONFIRM = 'CONFIRM';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const onSave = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    console.log('id', id)
    bookInterview(id, interview)
      .then((results) => {
        transition(SHOW); 
        console.log(results)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onCancel = () => {
    transition(CONFIRM)
  } 

  const onDelete = () => {
    // const interview = interviewObj;
    transition(DELETE);
    cancelInterview(id)
      .then((results) => {
        transition(EMPTY); 
        console.log(results)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  
  
  return (
  <article className="appointment">
    <Header time={time}/>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}
    {mode === SHOW && (
      <Show 
        student={interview.student} 
        interviewer={interview.interviewer}
        onDelete={onCancel}/>
    )}
    {mode === CREATE && (
      <Form 
        interviewers={interviewers}
        onCancel={() => back(EMPTY)}
        onSave={onSave}
      />
    )}
    {mode === SAVING && (<Status message="Saving..."/>)}
    {mode === DELETE && (<Status message="Deleting..."/>)}
    {mode === CONFIRM && (
      <Confirm
        message="Delete the appointment?" 
        onConfirm={() => transition(EMPTY)}
        onCancel={() => transition(SHOW)}
        onDelete={onDelete}
        />)}
  </article>
  )
}