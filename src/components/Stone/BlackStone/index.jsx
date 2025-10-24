import { ReactComponent as Black } from "../../../assets/icons/black.svg";
import { useAppStore } from "../../../store/appStore";
import style from "../style.module.scss";

export const BlackStone = ({ width }) => {
  const size = useAppStore.use.size();

  return (
    <Black
      className={style.stone}
      width={width || size}
      height={width || size}
    />
  );
};
