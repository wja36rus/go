import { useWebSocket } from "../hooks/useWebSocket";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {
  const { error, reconnect, isConnected, createUser, sendMove } = useWebSocket(
    "ws://localhost:8081"
  );

  const value = {
    error,
    reconnect,
    isConnected,
    createUser,
    sendMove,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
