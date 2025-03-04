import { createContext, useContext, useState, useEffect } from "react";
import { fetchSchedule, saveSchedule } from "../helpers/fetchSchedule";
import { clearWeek } from "../helpers/constants";
import { mergeIntervals } from "../helpers/mergeIntervals";

const ScheduleContext = createContext(undefined);

export const ScheduleProvider = ({ children }) => {
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const loadSchedule = async () => {
      const storedSchedule = localStorage.getItem("schedule");
      if (storedSchedule) {
        setSchedule(JSON.parse(storedSchedule));
      } else {
        const data = await fetchSchedule();
        setSchedule(data);
      }
    };
    loadSchedule();
  }, []);

  const toggleHour = (day, hour, forceState = null) => {
    setSchedule((prev) => {
      const minutes = hour * 60;
      let updated = [...(prev[day] || [])];

      const exists = updated.some(
        (interval) => interval.bt <= minutes && interval.et >= minutes
      );

      const shouldSelect = forceState !== null ? forceState : !exists;

      if (exists && !shouldSelect) {
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
      } else if (!exists && shouldSelect) {
        updated.push({ bt: minutes, et: minutes + 59 });
      }

      return { ...prev, [day]: mergeIntervals(updated) };
    });
  };

  const toggleAllDay = (day) => {
    setSchedule((prev) => {
      const isAllSelected = prev[day]?.some(
        (interval) => interval.bt === 0 && interval.et === 1439
      );

      return {
        ...prev,
        [day]: isAllSelected ? [] : [{ bt: 0, et: 1439 }],
      };
    });
  };

  const clearSchedule = () => {
    setSchedule(clearWeek);
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("schedule", JSON.stringify(schedule));
    saveSchedule(schedule);
  };

  return (
    <ScheduleContext.Provider
      value={{
        schedule,
        toggleHour,
        toggleAllDay,
        clearSchedule,
        saveToLocalStorage,
      }}
    >
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
