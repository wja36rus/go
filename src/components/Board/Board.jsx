import { useContext } from "react";
import style from "./style.module.scss";
import { AppContext } from "../../providers/AppContext";
import { v4 as uuidv4 } from "uuid";
import { ConnectionStatus } from "../ConnectionStatus/ConnectionStatus";
import { useState } from "react";
import { useAppStore } from "../../store/appStore";
import { useEffect } from "react";

import { WhiteStone } from "../Stone/WhiteStone";
import { BlackStone } from "../Stone/BlackStone";

export const Board = ({ children }) => {
  const [userData, setUserData] = useState();
  const [currentUser, setCurrentUser] = useState();

  const { createUser, isConnected, error, reconnect } = useContext(AppContext);
  const userId = sessionStorage.getItem("goUserId");

  const user = useAppStore.use.user();
  const start = useAppStore.use.start();

  useEffect(() => {
    setCurrentUser(user.find((item) => item.id == userId));
  }, [user]);

  const handlerCreateUser = () => {
    const userIdv4 = uuidv4();
    sessionStorage.setItem("goUserId", userIdv4);
    createUser({
      gameId: "local-game",
      id: userIdv4,
      name: userData,
    });
  };

  const stoneMap = {
    white: <WhiteStone width={50} />,
    black: <BlackStone width={50} />,
  };

  return (
    <>
      <div className="card">
        {user.map((item) => (
          <>
            <p>{item.name}</p>
            <p>{stoneMap[item.color]}</p>
          </>
        ))}

        {!currentUser && (
          <>
            <input
              className={style.input}
              type="text"
              onChange={(event) => setUserData(event.target.value)}
            />

            <button onClick={() => handlerCreateUser()}>
              Добавить пользователя
            </button>
          </>
        )}
        <p>Ход: {stoneMap[start]}</p>
        <ConnectionStatus
          isConnected={isConnected}
          error={error}
          onReconnect={reconnect}
        />
      </div>
      <div className={style.boardflex}>{children}</div>
    </>
  );
};
