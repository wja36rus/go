import { useWebSocket } from "../hooks/useWebSocket";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {
  const {
    error,
    reconnect,
    isConnected,
    createUser,
    sendMove,
    sendReload,
    sendClear,
  } = useWebSocket("ws://10.100.40.243:8081");

  const value = {
    error,
    reconnect,
    isConnected,
    sendClear,
    createUser,
    sendMove,
    sendReload,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
