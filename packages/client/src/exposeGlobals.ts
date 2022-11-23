import {
  getComponentEntities,
  getComponentValue,
  Has,
  HasValue,
  Not,
  NotValue,
  removeComponent,
  runQuery,
  setComponent,
} from "@latticexyz/recs";
import { Time } from "./utils/time";
import { NetworkLayer } from "./layers/network";
import { NoaLayer } from "./layers/noa";
import { PhaserLayer } from "./layers/phaser";
import { store } from "./store";

const ecs = {
  setComponent,
  removeComponent,
  getComponentValue,
  getComponentEntities,
  runQuery,
  Has,
  HasValue,
  Not,
  NotValue,
};

declare global {
  interface Window {
    ecs: typeof ecs;
    time: Time;
    layers: {
      network: NetworkLayer | null;
      noa: NoaLayer | null;
      phaser: PhaserLayer | null;
    };
  }
}

window.ecs = ecs;
window.time = Time.time;
window.layers = {
  network: store.getState().networkLayer,
  noa: store.getState().noaLayer,
  phaser: store.getState().phaserLayer,
};

store.subscribe((state) => {
  window.layers.network = state.networkLayer;
  window.layers.noa = state.noaLayer;
  window.layers.phaser = state.phaserLayer;
});
