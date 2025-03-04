import { createContext, useContext, useState, useEffect } from "react";
import { fetchSchedule, saveSchedule } from "../helpers/fetchSchedule";

const ScheduleContext = createContext(undefined);

export const ScheduleProvider = ({ children }) => {
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const loadSchedule = async () => {
      const storedSchedule = localStorage.getItem("schedule");
      if (storedSchedule) {
        setSchedule(JSON.parse(storedSchedule));
        console.log("Loaded from localStorage:", JSON.parse(storedSchedule));
      } else {
        const data = await fetchSchedule();
        setSchedule(data);
        saveSchedule(data);
      }
    };
    loadSchedule();
  }, []);

  const mergeIntervals = (intervals) => {
    if (intervals.length === 0) return [];
    const sorted = [...intervals].sort((a, b) => a.bt - b.bt);
    const merged = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const prev = merged[merged.length - 1];
      const curr = sorted[i];

      if (prev.et + 1 >= curr.bt) {
        prev.et = Math.max(prev.et, curr.et);
      } else {
        merged.push(curr);
      }
    }

    return merged;
  };

  const toggleHour = (day, hour) => {
    setSchedule((prev) => {
      const minutes = hour * 60;
      let updated = [...(prev[day] || [])];

      const exists = updated.some(
        (interval) => interval.bt <= minutes && interval.et >= minutes
      );

      if (exists) {
        updated = updated.flatMap((interval) => {
          if (interval.bt <= minutes && interval.et >= minutes) {
            if (interval.bt === minutes && interval.et === minutes + 59)
              return [];
            if (interval.bt === minutes)
              return [{ bt: minutes + 60, et: interval.et }];
            if (interval.et === minutes + 59)
              return [{ bt: interval.bt, et: minutes - 1 }];
            return [
              { bt: interval.bt, et: minutes - 1 },
              { bt: minutes + 60, et: interval.et },
            ];
          }
          return interval;
        });
      } else {
        updated.push({ bt: minutes, et: minutes + 59 });
      }

      const newSchedule = { ...prev, [day]: mergeIntervals(updated) };
      saveSchedule(newSchedule);
      return newSchedule;
    });
  };

  const toggleAllDay = (day) => {
    setSchedule((prev) => {
      const newSchedule =
        prev[day]?.length === 24
          ? { ...prev, [day]: [] }
          : { ...prev, [day]: [{ bt: 0, et: 1439 }] };
      saveSchedule(newSchedule);
      return newSchedule;
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
