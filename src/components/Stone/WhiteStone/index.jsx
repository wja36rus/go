import { ReactComponent as White } from "../../../assets/icons/white.svg";
import { useAppStore } from "../../../store/appStore";
import style from "../style.module.scss";

export const WhiteStone = ({ width }) => {
  const size = useAppStore.use.size();
  return (
    <White
      className={style.stone}
      width={width || size}
      height={width || size}
    />
  );
};
