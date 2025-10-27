import { useContext } from "react";
import { AppContext } from "../../providers/AppContext";

export const ExitGame = () => {
  const { sendExit } = useContext(AppContext);

  return (
    <div>
      <button onClick={sendExit}>Выйти из игры</button>
    </div>
  );
};
