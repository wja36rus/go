import style from "./style.module.scss";
import { ConnectionStatus } from "../ConnectionStatus/ConnectionStatus";
import { User } from "../User/User";

export const Board = ({ children }) => {
  return (
    <>
      <div className="card">
        <User />
        <ConnectionStatus />
      </div>
      <div className={style.boardflex}>{children}</div>
    </>
  );
};
