import { useSchedule } from "../hooks/useSchedule";
import { Button } from "./Button";

export const TableButtons = () => {
  const { clearSchedule, saveToLocalStorage } = useSchedule();

  return (
    <div className="table-buttons">
      <button text="Clear" onClick={() => clearSchedule()}>
        Clear
      </button>
      <button text="Save Changes" onClick={() => saveToLocalStorage()}>
        Save Changes
      </button>
    </div>
  );
};
