import { createContext, useContext, useState, useEffect } from "react";
import { fetchSchedule, saveSchedule } from "../helpers/fetchSchedule";
import {
  clearWeek,
  HOUR_INTERVAL,
  LAST_MINUTE_OF_DAY,
  MINUTES_IN_HOUR,
} from "../helpers/constants";
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
      const minutes = hour * MINUTES_IN_HOUR;
      let updated = [...(prev[day] || [])];

      const exists = updated.some(
        (interval) => interval.bt <= minutes && interval.et >= minutes
      );

      const shouldSelect = forceState !== null ? forceState : !exists;

      if (exists && !shouldSelect) {
        const HOUR_END = minutes + HOUR_INTERVAL;

        updated = updated.flatMap((interval) => {
          if (interval.bt > minutes || interval.et < minutes) {
            return interval;
          }

          if (interval.bt === minutes && interval.et === HOUR_END) {
            return [];
          }

          if (interval.bt === minutes) {
            return [{ bt: minutes + MINUTES_IN_HOUR, et: interval.et }];
          }

          if (interval.et === HOUR_END) {
            return [{ bt: interval.bt, et: minutes - 1 }];
          }

          return [
            { bt: interval.bt, et: minutes - 1 },
            { bt: minutes + MINUTES_IN_HOUR, et: interval.et },
          ];
        });
      } else if (!exists && shouldSelect) {
        updated.push({ bt: minutes, et: minutes + HOUR_INTERVAL });
      }

      return { ...prev, [day]: mergeIntervals(updated) };
    });
  };

  const toggleAllDay = (day) => {
    setSchedule((prev) => {
      const isAllSelected = prev[day]?.some(
        (interval) => interval.bt === 0 && interval.et === LAST_MINUTE_OF_DAY
      );

      return {
        ...prev,
        [day]: isAllSelected ? [] : [{ bt: 0, et: LAST_MINUTE_OF_DAY }],
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
