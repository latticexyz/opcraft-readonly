import React, { useMemo, useState } from "react";
import { pixelCoordToTileCoord } from "@latticexyz/phaserx";
import { map, distinctUntilChanged, merge, EMPTY } from "rxjs";
import styled from "styled-components";
import { TILE_HEIGHT, TILE_WIDTH } from "../../layers/phaser/constants";
import { mapObject, VoxelCoord } from "@latticexyz/utils";
import { getChunkCoord, getChunkEntity } from "../../utils/chunk";
import playerNames from "../../../data/playerNames.json";
import chunkClaims from "../../../data/chunkClaims.json";
import { getHighestTilesAt } from "../../layers/phaser/getHighestTilesAt";
import { useStore } from "../../store";
import { useView } from "../useView";
import { useObservableValue } from "../../useObservableValue";
import { Container } from "./Container";
import { Gold } from "./Text";
import { Button } from "./Button";
import { CloseableContainer } from "./CloseableContainer";

export const Position = () => {
  const [view, setView] = useView();
  const networkLayer = useStore((state) => state.networkLayer);
  const noaLayer = useStore((state) => state.noaLayer);
  const phaserLayer = useStore((state) => state.phaserLayer);

  const { x, y, z } = useObservableValue(
    useMemo(() => {
      if (!networkLayer || !noaLayer || !phaserLayer) return;

      const {
        scenes: {
          Main: { input },
        },
      } = phaserLayer;

      const {
        perlin,
        components: { Position, Item, Position2D },
      } = networkLayer;

      const {
        streams: { playerPosition$ },
      } = noaLayer;

      const pointerPosition$ = input.pointermove$.pipe(
        map(({ pointer }) => {
          const { x, y: z } = pixelCoordToTileCoord({ x: pointer.worldX, y: pointer.worldY }, TILE_WIDTH, TILE_HEIGHT);
          const { y } = getHighestTilesAt({ x, z, perlin, Position, Item, Position2D }) ?? { y: 0 };
          return { x, y, z };
        })
      );

      return merge(view === "map" ? pointerPosition$ : EMPTY, view === "game" ? playerPosition$.pipe() : EMPTY).pipe(
        map((position) => mapObject<VoxelCoord, VoxelCoord>(position, (value) => Math.round(value))),
        distinctUntilChanged((a, b) => a.x === b.x && a.y === b.y && a.z === b.z)
      );
    }, [networkLayer, noaLayer, phaserLayer, view]),
    { x: 0, y: 0, z: 0 }
  );

  const chunkId = getChunkEntity(getChunkCoord({ x, y, z }));
  const claim = chunkClaims.find((c) => c.chunkId === chunkId);
  const owner = claim ? playerNames.find((p) => p.address === claim.claimer) : null;
  const ownerName = owner?.name ?? claim?.claimer.replace(/^(0x[0-9A-F]{3})[0-9A-F]+([0-9A-F]{4})$/i, "$1…$2");

  const teleport = noaLayer?.api.teleport;
  const [showTeleport, setShowTeleport] = useState(false);

  return (
    <>
      <PositionContainer>
        {ownerName ? (
          <Container>
            <p>Chunk claimed by</p>
            <p>
              <Gold>{ownerName}</Gold>
            </p>
          </Container>
        ) : null}

        <Container style={{ width: "100px" }}>
          <p>X: {x}</p>
          <p>Y: {y}</p>
          <p>Z: {z}</p>
          <div style={{ marginTop: "8px" }}>
            <Button onClick={() => setShowTeleport(true)} disabled={!teleport} style={{ width: "100%" }}>
              Teleport
            </Button>
          </div>
        </Container>
      </PositionContainer>
      {showTeleport && teleport ? (
        <TeleportOverlay>
          <CloseableContainer onClose={() => setShowTeleport(false)}>
            <TeleportForm
              onSubmit={(event) => {
                event.preventDefault();
                setView("game");
                const formData = new FormData(event.currentTarget);
                const getNumber = (key: string) => {
                  const value = formData.get(key);
                  if (typeof value === "string" && /^-?\d+/.test(value)) {
                    return parseInt(value);
                  }
                };
                teleport({ x: getNumber("x") ?? 0, y: getNumber("y") ?? 0, z: getNumber("z") ?? 0 });
                setShowTeleport(false);
              }}
            >
              <div>
                <label>
                  X:
                  <input type="number" name="x" defaultValue={x} autoFocus />
                </label>
                <label>
                  Y:
                  <input type="number" name="y" defaultValue={y} />
                </label>
                <label>
                  Z:
                  <input type="number" name="z" defaultValue={z} />
                </label>
              </div>
              <Button type="submit">Teleport</Button>
            </TeleportForm>
          </CloseableContainer>
        </TeleportOverlay>
      ) : null}
    </>
  );
};

const PositionContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  line-height: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TeleportOverlay = styled.div`
  position: absolute;
  inset: -20px;
  background: rgba(31, 31, 31, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const TeleportForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  line-height: 1;

  label {
    display: flex;
    gap: 4px;
    align-items: center;
    margin: 2px 0;
  }
  input {
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    color: #ccc;
    width: 120px;

    padding: 4px 6px;
    border: 2px solid #555;
    background: none;

    :focus {
      outline: none;
      color: #fff;
      border-color: #777;
    }
  }
`;
