import createStore from "zustand/vanilla";
import createReactStore from "zustand";
import { NetworkLayer } from "./layers/network";
import { PhaserLayer } from "./layers/phaser";
import { NoaLayer } from "./layers/noa";

export type Store = {
  networkLayer: NetworkLayer | null;
  phaserLayer: PhaserLayer | null;
  noaLayer: NoaLayer | null;
};

export const store = createStore<Store>(() => ({
  networkLayer: null,
  phaserLayer: null,
  noaLayer: null,
}));

export const useStore = createReactStore(store);
