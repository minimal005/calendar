import { WEEKS } from "../helpers/constants";
import { useSchedule } from "../hooks/useSchedule";

export const WeekTable = () => {
  const { schedule, toggleHour, toggleAllDay } = useSchedule();

  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          <th rowspan={2}>All day</th>
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
        {WEEKS.map((day) => (
          <tr key={day}>
            <th>{day}</th>
            <th>
              <img src="./check.png" alt="all-day" />
            </th>
            {[...Array(24)].map((_, index) => (
              <td key={index}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
