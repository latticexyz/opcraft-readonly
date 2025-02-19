import { pixelCoordToTileCoord } from "@latticexyz/phaserx";
import { defineRxSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { TILE_WIDTH, TILE_HEIGHT } from "../constants";
import { getHighestTilesAt } from "../getHighestTilesAt";
import { PhaserLayer } from "../types";
import { filter } from "rxjs";
import { router } from "../../../router";
import { store } from "../../../store";

export function createInputSystem(context: PhaserLayer, network: NetworkLayer) {
  const {
    world,
    scenes: {
      Main: { input, camera },
    },
  } = context;
  const {
    perlin,
    components: { Position, Item, Position2D },
  } = network;

  // click-and-drag to move the camera
  defineRxSystem(
    world,
    input.pointermove$.pipe(
      filter(
        ({ pointer }) =>
          pointer.isDown &&
          pointer.downElement instanceof HTMLCanvasElement &&
          // ignore events when there's no currentTarget, which seems to capture when the mouse is over plugin UI
          !!pointer.event.currentTarget
      )
    ),
    ({ pointer }) => {
      const deltaX = (pointer.x - pointer.prevPosition.x) / camera.phaserCamera.zoom;
      const deltaY = (pointer.y - pointer.prevPosition.y) / camera.phaserCamera.zoom;
      camera.setScroll(camera.phaserCamera.scrollX - deltaX, camera.phaserCamera.scrollY - deltaY);
    }
  );

  // TODO: highlight tile on hover, then use click instead of double click to teleport
  //       or optionally click once to select a tile, then click a button in UI to teleport
  // TODO: don't activate double click if clicking within an input, label, etc. to not interfere with form elements
  defineRxSystem(
    world,
    input.doubleClick$.pipe(filter((pointer) => pointer.event.target instanceof HTMLCanvasElement)),
    async (pointer) => {
      const { noaLayer } = store.getState();
      if (!noaLayer) {
        console.log("not teleporting, no noa layer");
        return;
      }
      if (!noaLayer.noa._paused) {
        console.log("not teleporting, noa is not paused (already in noa?)");
        return;
      }

      const pixelCoord = { x: pointer.worldX, y: pointer.worldY };
      const { x, y: z } = pixelCoordToTileCoord(pixelCoord, TILE_WIDTH, TILE_HEIGHT);
      const highestTiles = getHighestTilesAt({ x, z, perlin, Position, Item, Position2D });
      if (!highestTiles) {
        console.log("not teleporting, no highest tile found at", pixelCoord);
        return;
      }

      // TODO: move this to store and reverse the source of truth from url to store?
      const params = new URLSearchParams(window.location.search);
      params.set("view", "game");
      console.log(`navigating to ${window.location.pathname}?${params.toString()}`);
      router.navigate({ search: params.toString() });

      // offset x, z by 0.5 to center player on block
      // and offset y by 1 to be above block
      // TODO: should this be part of teleport itself?
      noaLayer.api.teleport({ x: x + 0.5, y: highestTiles.y + 1, z: z + 0.5 });
    }
  );
}
