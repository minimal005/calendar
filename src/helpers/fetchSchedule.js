export const fetchSchedule = async () => {
  try {
    const response = await fetch("/schedule.json"); // ✅ Браузерний fetch, без fs
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data || {};
  } catch {
    return {};
  }
};

export const saveSchedule = (newSchedule) => {
  localStorage.setItem("schedule", JSON.stringify(newSchedule));
};
