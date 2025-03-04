import { useState, useEffect } from "react";
import { useSchedule } from "../hooks/useScheduleContext";
import { MINUTES_IN_HOUR } from "../helpers/constants";

export const useScheduleTable = () => {
  const { schedule, toggleHour, toggleAllDay } = useSchedule();
  const [isDragSelecting, setIsDragSelecting] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
      setIsDragSelecting(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  const handleCellMouseDown = (day, hour) => {
    const minutes = hour * MINUTES_IN_HOUR;
    const isSelected = schedule[day]?.some(
      (interval) => interval.bt <= minutes && interval.et >= minutes
    );

    setIsMouseDown(true);

    if (!isSelected) {
      setIsDragSelecting(true);
    } else {
      setIsDragSelecting(false);
    }

    toggleHour(day, hour);
  };

  const handleCellMouseEnter = (day, hour) => {
    if (isMouseDown && isDragSelecting) {
      toggleHour(day, hour, true);
    }
  };

  const handleAllDayClick = (day) => {
    toggleAllDay(day);
  };

  const isHourSelected = (day, hour) => {
    const minutes = hour * MINUTES_IN_HOUR;
    return schedule[day]?.some(
      (interval) => interval.bt <= minutes && interval.et >= minutes
    );
  };

  const isAllDaySelected = (day) => {
    return schedule[day]?.some(
      (interval) => interval.bt === 0 && interval.et === 1439
    );
  };

  return {
    isAllDaySelected,
    isHourSelected,
    handleAllDayClick,
    handleCellMouseEnter,
    handleCellMouseDown,
    schedule,
  };
};
