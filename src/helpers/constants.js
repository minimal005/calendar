export const WEEKS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

export const clearWeek = {
  mo: [],
  tu: [],
  we: [],
  th: [],
  fr: [],
  sa: [],
  su: [],
};

const HOURS_IN_DAY = 24;
export const HOURS = [0, 3, 6, 9, 12, 15, 18, 21];
export const MINUTES_IN_HOUR = 60;
export const HOUR_INTERVAL = MINUTES_IN_HOUR - 1;
export const LAST_MINUTE_OF_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR - 1;
