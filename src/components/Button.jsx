export const Button = ({ text, props }) => {
  return (
    <button {...props} className="table-button">
      {text}
    </button>
  );
};
