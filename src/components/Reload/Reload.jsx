import { useContext } from "react";
import { AppContext } from "../../providers/AppContext";

export const Reload = () => {
  const { sendReload } = useContext(AppContext);

  return (
    <div>
      <button onClick={sendReload}>Начать заново</button>
    </div>
  );
};
