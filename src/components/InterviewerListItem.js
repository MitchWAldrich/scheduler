import React from "react";
import classNames from 'classnames/bind';


import "components/InterviewerListItem.scss";

//id:number
//name:string
//avatar:url
//selected:boolean
//setInterviewer:function
export default function InterviewerListItem(props) {
  const { name, avatar, selected, setInterviewer } = props;
  
  let interviewerClass = classNames('interviewers__item', {
    'interviewers__item--selected': selected
  })

  return (
    <li 
    className={interviewerClass}
    onClick={setInterviewer}>
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
      {selected && name}
    </li>
  )
}