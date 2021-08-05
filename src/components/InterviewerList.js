import React from "react";
// import classNames from 'classnames/bind';


import "components/InterviewerList.scss";

import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const { interviewers, interviewer, setInterviewer } = props;
  
  const parsedInterviewers = interviewers.map(data => 
    <InterviewerListItem
      key={data.id}
      name={data.name}
      avatar={data.avatar}
      selected={data.id === interviewer}
      setInterviewer={(event) => setInterviewer(data.id)} 
      />); //don't need to {...data} ??

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {parsedInterviewers}
      </ul>
    </section>
  )
}