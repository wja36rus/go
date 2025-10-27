import { useContext } from "react";
import { AppContext } from "../../providers/AppContext";
import style from "./style.module.scss";

export const ConnectionStatus = () => {
  const { isConnected, error, reconnect } = useContext(AppContext);

  return (
    <div className={style.connectionStatus}>
      <div>{isConnected ? "🟢 Connected" : "🔴 Disconnected"}</div>

      {error && <div className="error-message">Error: {error}</div>}

      {!isConnected && (
        <button onClick={reconnect} className="reconnect-btn">
          Reconnect
        </button>
      )}
    </div>
  );
};
