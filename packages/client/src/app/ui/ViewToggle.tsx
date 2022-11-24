import React from "react";
import styled from "styled-components";
import { TILE_HEIGHT, TILE_WIDTH } from "../../layers/phaser/constants";
import { Container } from "../../layers/react/components/common";
import { useStore } from "../../store";
import { useView } from "../useView";

export const ViewToggle = () => {
  const [view, setView] = useView();

  const noaLayer = useStore((state) => state.noaLayer);
  const phaserLayer = useStore((state) => state.phaserLayer);

  return (
    <ViewToggleContainer>
      <input
        id="ViewToggle-field-view-map"
        type="radio"
        name="view"
        value="map"
        checked={view === "map"}
        disabled={noaLayer == null || phaserLayer == null}
        onChange={() => {
          if (noaLayer == null || phaserLayer == null) return;
          const { x, z } = noaLayer.api.getCurrentPlayerPosition();
          phaserLayer.scenes.Main.camera.centerOnCoord({ x, y: z }, TILE_WIDTH, TILE_HEIGHT);
          setView("map");
        }}
      />
      <label htmlFor="ViewToggle-field-view-map">Map</label>
      <input
        id="ViewToggle-field-view-game"
        type="radio"
        name="view"
        value="game"
        checked={view === "game"}
        onChange={() => {
          setView("game");
          // TODO: teleport to current map center position?
        }}
      />
      <label htmlFor="ViewToggle-field-view-game">Game</label>
    </ViewToggleContainer>
  );
};

const ViewToggleContainer = styled(Container)`
  position: absolute;
  left: 0;
  top: 0;
  line-height: 1;
  pointer-events: all;

  input[type="radio"] {
    display: none;
  }
  label {
    padding: 4px 6px;
    cursor: pointer;
    border-radius: 4px;
  }
  label:hover {
    background-color: #444;
  }
  input:checked + label {
    background-color: #060;
  }
`;
