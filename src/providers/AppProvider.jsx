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
    sendExit,
    sendClear,
    setClear,
  } = useWebSocket("ws://10.100.40.243:8081");

  const value = {
    error,
    reconnect,
    isConnected,
    sendClear,
    createUser,
    sendExit,
    sendMove,
    sendReload,
    setClear,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
