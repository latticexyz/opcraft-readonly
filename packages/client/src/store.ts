import createStore from "zustand/vanilla";
import createReactStore from "zustand";
import { NetworkLayer } from "./layers/network";
import { PhaserLayer } from "./layers/phaser";
import { NoaLayer } from "./layers/noa";

export const store = createStore<{
  networkLayerPromise: Promise<NetworkLayer> | null;
  networkLayer: NetworkLayer | null;
  phaserLayer: PhaserLayer | null;
  noaLayer: NoaLayer | null;
}>(() => ({
  networkLayerPromise: null,
  networkLayer: null,
  phaserLayer: null,
  noaLayer: null,
}));

// resolve promise so that it's easier to use downstream
store.subscribe((state, prevState) => {
  if (state.networkLayerPromise !== prevState.networkLayerPromise) {
    state.networkLayerPromise?.then((networkLayer) => {
      // discard if the promise has changed
      if (store.getState().networkLayerPromise !== state.networkLayerPromise) return;
      store.setState({ networkLayer });
    });
  }
});

export const useStore = createReactStore(store);
