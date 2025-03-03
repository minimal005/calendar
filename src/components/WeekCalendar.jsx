import React from "react";
import { WeekTable } from "./WeekTable";
import { TableButtons } from "./TableButtons";

const WeekCalendar = () => {
  return (
    <section className="calendar">
      <h1 className="calendar__title">Set schedule</h1>
      <WeekTable />
      <TableButtons />
    </section>
  );
};

export default WeekCalendar;
