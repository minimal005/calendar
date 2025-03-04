import "./App.scss";
import WeekCalendar from "./components/WeekCalendar";
import { ScheduleProvider } from "./hooks/useScheduleContext";

function App() {
  return (
    <ScheduleProvider>
      <WeekCalendar />
    </ScheduleProvider>
  );
}

export default App;
