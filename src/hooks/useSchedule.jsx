import { createContext, useContext, useState, ReactNode } from "react";

const ScheduleContext = createContext(undefined);

export const ScheduleProvider = ({ children }) => {
  const [schedule, setSchedule] = useState({
    mo: [{ bt: 240, et: 779 }],
    tu: [],
    we: [],
    th: [
      { bt: 240, et: 779 },
      { bt: 1140, et: 1319 },
    ],
    fr: [{ bt: 660, et: 1019 }],
    sa: [{ bt: 0, et: 1439 }],
    su: [],
  });

  // Тогл однієї години
  const toggleHour = (day, hour) => {
    setSchedule((prev) => {
      const minutes = hour * 60;
      let updated = [...(prev[day] || [])];

      // Видаляємо інтервал, якщо година вже вибрана
      updated = updated.filter(
        (interval) => !(interval.bt <= minutes && interval.et > minutes)
      );

      // Якщо не вибрана - додаємо
      if (updated.length === prev[day]?.length) {
        updated.push({ bt: minutes, et: minutes + 59 });
      }

      return { ...prev, [day]: updated };
    });
  };

  const toggleAllDay = (day) => {
    setSchedule((prev) => {
      return prev[day]?.length === 24
        ? { ...prev, [day]: [] } // Забираємо всі години
        : { ...prev, [day]: [{ bt: 0, et: 1439 }] }; // Виділяємо весь день
    });
  };

  return (
    <ScheduleContext.Provider value={{ schedule, toggleHour, toggleAllDay }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context)
    throw new Error("useSchedule must be used within a ScheduleProvider");
  return context;
};
