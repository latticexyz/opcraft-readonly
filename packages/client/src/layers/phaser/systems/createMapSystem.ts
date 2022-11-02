import { defineEnterSystem, defineRxSystem, getComponentValue, getComponentValueStrict, Has } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { PhaserLayer } from "../types";
import { BackgroundTiles, ForegroundTiles } from "../assets/tilesets/opcraftTileset";
import { getBlockAtPosition, getTerrain } from "../../network/api";
import { createPerlin } from "@latticexyz/noise";
import { BlockIdToKey, BlockType } from "../../network/constants";

// Draw the 2D map
export function createMapSystem(context: PhaserLayer, network: NetworkLayer) {
  const {
    components: { Position, Item },
  } = network;

  const {
    world,
    scenes: {
      Main: {
        maps: { Main },
      },
    },
    chunks,
  } = context;

  // Draw map for ECS tiles
  defineEnterSystem(world, [Has(Position), Has(Item)], ({ entity }) => {
    console.log("entered", entity);
    const position = getComponentValueStrict(Position, entity);
    const item = getComponentValueStrict(Item, entity).value;

    // Main.putTileAt(position, Textures[item]);
  });

  // TODO: populate currently visible chunks

  defineRxSystem(world, chunks.addedChunks$, async (addedChunk) => {
    // TODO: for each coordinate in the chunk:
    // - check if nothing is drawn on the tilemap yet
    // - if so, find the terrain hight (getHeight) and the terrain block at this coordinate (map 2D to 3D coord: {x: x, y: height, z: y})
    // (Hint: all the functions needed for this are in this folder in OPCraft: https://github.com/latticexyz/opcraft/tree/main/packages/client/src/layers/network/api/terrain)

    // TODO: export these from somewhere?
    const tilesPerChunk = chunks.chunkSize / 16;
    const perlin = await createPerlin();

    for (let xOffset = 0; xOffset < tilesPerChunk; xOffset++) {
      for (let yOffset = 0; yOffset < tilesPerChunk; yOffset++) {
        const x = addedChunk.x * tilesPerChunk + xOffset;
        const z = addedChunk.y * tilesPerChunk + yOffset;
        // iterate through Y position since perlin terrain may not have the highest placed block
        // TODO: is there a more efficient way to do this?
        for (let y = 128; y > -128; y--) {
          const entityId = getBlockAtPosition({ Position, Item, world }, perlin, { x, y, z });
          const blockType = BlockIdToKey[entityId];

          if (blockType === "Air") continue;

          const foregroundTile = ForegroundTiles[blockType];
          if (foregroundTile) {
            Main.putTileAt({ x, y: z }, foregroundTile, "Foreground");
            // Continue down y axis to get the background tile
            continue;
          }
          const backgroundTile = BackgroundTiles[blockType];
          if (backgroundTile) {
            Main.putTileAt({ x, y: z }, backgroundTile, "Background");
            // Stop drawing tile for this x, z
            break;
          }

          // Ignore flowers for now
          if (!blockType.endsWith("Flower")) {
            console.log(`No background tile found for block type ${blockType}`);
          }
        }
      }
    }
  });
}
