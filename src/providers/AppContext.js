import { createContext } from "react";

export const AppContext = createContext({
  createUser: () => null,
  sendMove: () => null,
  sendClear: () => null,
  setClear: () => null,
  sendExit: () => null,
  reload: () => null,
});
