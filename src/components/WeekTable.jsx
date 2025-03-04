import { useScheduleTable } from "../hooks/useScheduleTable";

export const WeekTable = () => {
  const {
    isAllDaySelected,
    isHourSelected,
    handleAllDayClick,
    handleCellMouseEnter,
    handleCellMouseDown,
    schedule,
  } = useScheduleTable();
  if (!schedule || Object.keys(schedule).length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <table className="table">
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
            <th onClick={() => handleAllDayClick(day)}>
              <img
                src="./check.png"
                alt="all-day"
                style={{
                  display: isAllDaySelected(day) ? "flex" : "none",
                  cursor: "pointer",
                }}
              />
            </th>
            {[...Array(24)].map((_, hour) => (
              <td
                key={hour}
                onMouseDown={(e) => {
                  if (e.button === 0) {
                    handleCellMouseDown(day, hour);
                  }
                }}
                onMouseEnter={() => handleCellMouseEnter(day, hour)}
                style={{
                  backgroundColor: isHourSelected(day, hour)
                    ? "#6e6f705f"
                    : "#e3f3f8",
                  cursor: "pointer",
                }}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
