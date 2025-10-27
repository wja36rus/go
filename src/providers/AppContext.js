import { createContext } from "react";

export const AppContext = createContext({
  createUser: () => null,
  sendMove: () => null,
  reload: () => null,
});
