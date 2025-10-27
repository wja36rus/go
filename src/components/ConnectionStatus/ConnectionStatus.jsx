import { useContext } from "react";
import { AppContext } from "../../providers/AppContext";
import style from "./style.module.scss";
import { Reload } from "../Reload/Reload";

export const ConnectionStatus = () => {
  const { isConnected, error, reconnect } = useContext(AppContext);

  return (
    <div className={style.connectionStatus}>
      <div>
        <Reload />
        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>

      {error && <div className="error-message">Error: {error}</div>}

      {!isConnected && (
        <button onClick={reconnect} className="reconnect-btn">
          Reconnect
        </button>
      )}
    </div>
  );
};
