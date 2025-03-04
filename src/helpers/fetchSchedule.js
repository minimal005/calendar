export const fetchSchedule = async () => {
  try {
    const response = await fetch("/schedule.json"); // ✅ Браузерний fetch, без fs
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched data:", data);
    return data || {};
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return {};
  }
};

export const saveSchedule = (newSchedule) => {
  localStorage.setItem("schedule", JSON.stringify(newSchedule));
  console.log("Saved schedule:", newSchedule);
};
