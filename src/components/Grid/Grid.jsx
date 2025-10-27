import style from "./style.module.scss";
import { useAppStore } from "../../store/appStore";
import { WhiteStone } from "../Stone/WhiteStone";
import { BlackStone } from "../Stone/BlackStone";
import { useContext } from "react";
import { AppContext } from "../../providers/AppContext";
import cn from "classnames";
import { useState } from "react";

export const Grid = () => {
  const { sendMove, sendClear } = useContext(AppContext);
  const [clear, setClear] = useState(false);

  const col = useAppStore.use.col();
  const row = useAppStore.use.row();
  const count = useAppStore.use.count();
  const point = useAppStore.use.point();
  const activeUser = sessionStorage.getItem("goUserId");
  const userData = useAppStore.use.user();
  const start = useAppStore.use.start();

  const GridItem = () => {
    const grid = [];
    for (let i = 0; i < count; i++) {
      grid.push(i);
    }

    return grid.map((item) => <div key={item} className={style.grid} />);
  };

  const Point = () => {
    function outputSixThenFive(arr) {
      let step = 9;
      let i = 0;
      const result = [];

      while (i < arr.length) {
        const end = Math.min(i + step, arr.length);
        const chunk = arr.slice(i, end);

        result.push(chunk);

        i += step;
      }

      return result;
    }

    return outputSixThenFive(point).map((item, index) => (
      <div key={index} className={style.pointLine}>
        {item.map(({ id, user, last }) => (
          <PointItem key={id} id={id} user={user} last={last} />
        ))}
      </div>
    ));
  };

  const getStoneByUser = (user) => {
    return userData.find((item) => item.id == user)?.color;
  };

  const PointItem = ({ id, user, last }) => {
    const handlerCheckStone = (id) => {
      const coloUser = getStoneByUser(activeUser);

      if (clear) {
        sendClear({
          cellId: id,
          uuid: activeUser,
          gameId: "local-game",
        });
      } else {
        if (coloUser == start) {
          sendMove({
            cellId: id,
            uuid: activeUser,
            gameId: "local-game",
          });
        }
      }
    };

    const stoneMap = {
      white: <WhiteStone />,
      black: <BlackStone />,
    };

    return (
      <div
        className={cn(style.point, last && style.pointLast)}
        onClick={() => handlerCheckStone(id)}
      >
        {stoneMap[getStoneByUser(user)]}
      </div>
    );
  };

  return (
    <>
      <button
        className={cn(clear ? style.clearButtonOn : style.clearButtonOff)}
        onClick={() => setClear(!clear)}
      >
        {clear ? "Выключить очистку" : "Включить очистку"}
      </button>
      <div
        style={{
          gridTemplateColumns: `repeat(${col}, 0fr)`,
          gridTemplateRows: `repeat(${row}, 0fr)`,
        }}
        className={style.gridWrapper}
      >
        <div className={style.pointWrapper}>
          <Point />
        </div>
        <GridItem />
      </div>
    </>
  );
};
