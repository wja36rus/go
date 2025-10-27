import { WhiteStone } from "../Stone/WhiteStone";
import { BlackStone } from "../Stone/BlackStone";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useAppStore } from "../../store/appStore";
import { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../../providers/AppContext";
import style from "./style.module.scss";

export const User = () => {
  const [currentUser, setCurrentUser] = useState();
  const start = useAppStore.use.start();
  const { createUser } = useContext(AppContext);
  const userId = sessionStorage.getItem("goUserId");
  const user = useAppStore.use.user();

  useEffect(() => {
    setCurrentUser(user.find((item) => item.id == userId));
  }, [user]);

  const stoneMap = {
    white: <WhiteStone width={50} />,
    black: <BlackStone width={50} />,
  };

  const handlerInput = (event) => {
    const { code } = event;
    const { value } = event.target;

    if (code === "Enter") {
      const userIdv4 = uuidv4();
      sessionStorage.setItem("goUserId", userIdv4);
      createUser({
        gameId: "local-game",
        id: userIdv4,
        name: value,
      });
    }
  };

  return (
    <>
      {user.map((item) => (
        <div key={item.id} className={style.userList}>
          <p>{item.name}</p>
          <p>{stoneMap[item.color]}</p>
          <p>Съедено: {item?.eats?.length}</p>
        </div>
      ))}

      {!currentUser && (
        <input
          placeholder="Введите имя"
          className={style.input}
          type="text"
          onKeyDown={handlerInput}
        />
      )}
      <div className={style.next}>
        <p>Ход: </p>
        {stoneMap[start]}
      </div>
    </>
  );
};
