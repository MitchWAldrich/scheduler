import React from "react";
import classNames from 'classnames/bind';

import "components/DayListItem.scss";

export default function DayListItem(props) {
  const { name, spots, selected, setDay } = props;

  const formatSpots = (spots) => {
    let spotsRemaining = '';

    if (spots === 0) spotsRemaining = 'no spots remaining';
    if (spots === 1) spotsRemaining = `${spots} spot remaining`;
    if (spots > 1) spotsRemaining = `${spots} spots remaining`;
    return spotsRemaining;
  }

  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': selected,
    'day-list__item--full': spots === 0   
  })
  return (
    <li className={dayClass} onClick={() => {setDay(name)}} data-testid="day">
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}