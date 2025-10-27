import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withSelectors } from "../utils/withSelectors";
import { immer } from "zustand/middleware/immer";

const initialData = {
  size: 100,
  col: 8,
  row: 8,
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
      point: [],
      start: "black",
      clear: false,

      setData: (data) =>
        set((state) => {
          if (typeof data !== "undefined") {
            const { user, point, start, clear } = data;
            state.user = user;
            state.point = point;
            state.start = start;
            state.clear = clear;
          }
        }),
    }))
  )
);

export const useAppStore = withSelectors(useAppStoreBase);
