import { useState } from "react";
import { useSchedule } from "../hooks/useSchedule";

export const WeekTable = () => {
  const { schedule, toggleHour, toggleAllDay } = useSchedule();
  const [isDragging, setIsDragging] = useState(false);

  if (!schedule || Object.keys(schedule).length === 0) {
    return <p>Loading...</p>;
  }

  const handleMouseDown = (day, hour) => {
    setIsDragging(true);
    toggleHour(day, hour);
  };

  const handleMouseEnter = (day, hour) => {
    if (isDragging) {
      toggleHour(day, hour);
    }
  };
  return (
    <table
      className="table"
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <thead>
        <tr>
          <th></th>
          <th rowSpan={2}>All day</th>
          {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
            <th key={hour} colSpan={3}>
              {hour.toString().padStart(2, "0")}:00
            </th>
          ))}
        </tr>
        <tr>
          <th></th>
          {[...Array(8)].map((_, index) => (
            <th
              key={index}
              colSpan={3}
              style={{
                borderLeft: "1px solid rgba(66, 66, 66, 0.274)",
                borderColor: "rgba(66, 66, 66, 0.825)",
              }}
            ></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(schedule).map((day) => (
          <tr key={day}>
            <th>{day}</th>
            <th onClick={() => toggleAllDay(day)}>
              <img src="./check.png" alt="all-day" />
            </th>
            {[...Array(24)].map((_, hour) => (
              <td
                key={hour}
                onMouseDown={() => handleMouseDown(day, hour)}
                onMouseEnter={() => handleMouseEnter(day, hour)}
                style={{
                  backgroundColor: schedule[day].some(
                    ({ bt, et }) => bt / 60 <= hour && et / 60 > hour
                  )
                    ? "darkgray"
                    : "#d9f2f8",
                }}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
