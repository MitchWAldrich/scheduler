import React from "react";

import DayListItem from "./DayListItem";

export default function DayList(props) {
  const { days, day, setDay } = props;
  
  const parsedDays = days.map(data => 
    <DayListItem
      key={data.id}
      name={data.name}
      spots={data.spots}
      selected={data.name === day}
      setDay={setDay} 
      {...data}/>)

  return (
    <ul>
      {parsedDays}
    </ul>
  )
}
