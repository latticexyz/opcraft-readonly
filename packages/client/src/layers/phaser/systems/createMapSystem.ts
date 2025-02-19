import { defineRxSystem, getComponentValue } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { Maps, PhaserLayer } from "../types";
import { HeightMapTiles } from "../assets/tilesets/opcraftTileset";
import { Coord, CoordMap } from "@latticexyz/utils";
import { StepSizePerZoomLevel, ZoomLevel } from "../constants";
import { merge, Subject } from "rxjs";
import { TILE_HEIGHT } from "../constants";
import { getHighestTilesAt } from "../getHighestTilesAt";

// TODO: rescale tiles to 2x current size, since the default zoom/scale of the map is now 1x to help with container sizing

/**
 * System reacts to viewport changes and draws the map data (ecs, procgen) to the phaser tilemap
 */
export function createMapSystem(context: PhaserLayer, network: NetworkLayer) {
  // Extract relevant data from the context objects
  const {
    components: { Position, Item, Position2D },
    perlin,
    SingletonEntity,
  } = network;
  const {
    world,
    chunks,
    zoomLevel$,
    maps,
    scenes: {
      Main: {
        phaserScene,
        maps: { Heat },
      },
    },
    components: { UI },
  } = context;

  // Setup local variables
  const computedTiles = new CoordMap<boolean>();
  const addedChunks$ = new Subject<Coord>();
  chunks.addedChunks$.subscribe(addedChunks$);
  const newTile$ = new Subject<Coord>();

  // Prevent clearing the entire map before each redraw (before each tick)
  (phaserScene.game.renderer.config as any).clearBeforeRender = false;
  /**
   * Draw the given tile at the given coord on the given layer on all maps
   */
  function drawTile(x: number, y: number, tile: number, maps: Maps, layer?: "Foreground" | "Background") {
    for (const [zoom, map] of Object.entries(maps)) {
      const stepSize = StepSizePerZoomLevel[parseInt(zoom) as ZoomLevel];
      if (x % stepSize === 0 && y % stepSize === 0) {
        map.putTileAt({ x: x / stepSize, y: y / stepSize }, tile, layer);
      }
    }
  }

  /**
   * Compute the block type (ecs, procgen) at each coordinate coming through the newTile$ stream
   * and draw it on the phaser tilemap
   */
  defineRxSystem(world, newTile$, async ({ x, y: z }) => {
    const highestTiles = getHighestTilesAt({ x, z, perlin, Position, Position2D, Item });
    if (!highestTiles) return;

    const { y, foregroundTile, backgroundTile } = highestTiles;

    const heightTile = HeightMapTiles[Math.max(-8, Math.min(8, Math.floor(y / 8)))];
    if (heightTile != null) {
      drawTile(x, z, heightTile, maps.height);
    }
    if (foregroundTile != null) {
      drawTile(x, z, foregroundTile, maps.terrain, "Foreground");
    }
    if (backgroundTile != null) {
      drawTile(x, z, backgroundTile, maps.terrain, "Background");
    }
  });

  /**
   * Compute new relevant (= not computed yet and visible in current zoom level) tiles
   * in the chunks coming through the addedChunk$ stream
   */
  defineRxSystem(world, addedChunks$, (chunk) => {
    const tilesPerChunk = chunks.chunkSize / TILE_HEIGHT;
    const { zoomLevel } = zoomLevel$.getValue();
    const stepSize = StepSizePerZoomLevel[zoomLevel];

    for (let xOffset = 0; xOffset < tilesPerChunk; xOffset += stepSize) {
      for (let yOffset = 0; yOffset < tilesPerChunk; yOffset += stepSize) {
        const x = chunk.x * tilesPerChunk + xOffset;
        const y = chunk.y * tilesPerChunk + yOffset;
        const coord = { x, y };

        if (!computedTiles.get(coord)) {
          newTile$.next(coord);
          computedTiles.set(coord, true);
        }
      }
    }
  });

  /**
   * React to zoom level changes by sending chunks in the current viewport through addedChunks$
   * (because they might include tiles that weren't relevant in the previous zoom level but are relevant now)
   */
  defineRxSystem(world, zoomLevel$, () => {
    for (const chunk of chunks.visibleChunks.current.coords()) {
      addedChunks$.next(chunk);
    }
  });

  /**
   * React to zoom level changes by enabling/disabling tilemaps maps relevant/irrelevant to the new zoom level
   */
  defineRxSystem(world, merge(zoomLevel$, UI.update$), () => {
    const { zoomLevel } = zoomLevel$.getValue();
    const visible = getComponentValue(UI, SingletonEntity);

    // Toggle maps when zooming out
    for (const [mapZoomLevel, map] of Object.entries(maps.terrain)) {
      map.setVisible(Boolean(visible?.terrain) && zoomLevel === parseInt(mapZoomLevel));
    }
    for (const [mapZoomLevel, map] of Object.entries(maps.height)) {
      map.setVisible(Boolean(visible?.height) && zoomLevel === parseInt(mapZoomLevel));
    }

    // Hack to make sure heat map is on top
    Heat.setVisible(!visible?.activity);
    Heat.setVisible(Boolean(visible?.activity));
  });
}
