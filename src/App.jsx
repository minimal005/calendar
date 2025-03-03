import "./App.scss";
import WeekCalendar from "./components/WeekCalendar";
import { ScheduleProvider } from "./hooks/useSchedule";

function App() {
  return (
    <ScheduleProvider>
      <WeekCalendar initialData={{}} />
    </ScheduleProvider>
  );
}

export default App;
