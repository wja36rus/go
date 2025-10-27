import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withSelectors } from "../utils/withSelectors";
import { immer } from "zustand/middleware/immer";

const initialData = {
  size: 100,
  col: 8,
  row: 8,
};

const points = () => {
  const result = [];

  for (let index = 0; index < (col + 1) * (row + 1); index++) {
    result.push({ id: index + 1, user: "" });
  }

  return result;
};

const { col, row, size } = initialData;
const useAppStoreBase = create()(
  devtools(
    immer((set) => ({
      user: [],
      size: size,
      col: col,
      row: row,
      count: col * row,
      point: points(),
      start: "black",

      addUser: (user) =>
        set((state) => {
          if (state.user.length > 1) {
            return;
          }

          if (state.user.length == 0) {
            state.user = [...state.user, { ...user, color: "black" }];
          } else {
            state.user = [...state.user, { ...user, color: "white" }];
          }
        }),
      setStoneByUser: (move) => {
        set((state) => {
          const find = state.point.find((item) => item.id == move.cellId);

          if (find.user !== "") {
            find.user = "";
            return;
          }

          find.user = move.uuid;

          if (state.start == "black") {
            state.start = "white";
          } else {
            state.start = "black";
          }
        });
      },
    }))
  )
);

export const useAppStore = withSelectors(useAppStoreBase);
