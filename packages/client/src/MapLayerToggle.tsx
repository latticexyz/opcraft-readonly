import React, { useEffect, useState } from "react";
import { map, concat, of } from "rxjs";
import styled from "styled-components";
import { Container } from "./layers/react/components/common";
import { getComponentValue } from "@latticexyz/recs";
import { useNetworkLayer } from "./useNetworkLayer";
import { useStore } from "./store";

const useToggles = () => {
  const networkLayer = useNetworkLayer();
  const phaserLayer = useStore((state) => state.phaserLayer);
  const [toggles, setToggles] = useState({
    activity: false,
    height: false,
    terrain: false,
  });

  useEffect(() => {
    if (!networkLayer || !phaserLayer) return;

    const {
      components: { UI },
    } = phaserLayer;
    const { SingletonEntity } = networkLayer;

    const subscription = concat(
      of(getComponentValue(UI, SingletonEntity)),
      UI.update$.pipe(map((update) => update.value[0]))
    ).subscribe((update) => {
      if (!update) return;
      setToggles(update);
    });
    return () => subscription.unsubscribe();
  }, [networkLayer, phaserLayer]);

  return toggles;
};

export const MapLayerToggle = () => {
  const toggles = useToggles();
  const phaserLayer = useStore((state) => state.phaserLayer);
  const toggleMap = phaserLayer?.api.toggleMap;
  return (
    <MapLayerToggleContainer>
      <p>
        <label>
          <input
            type="checkbox"
            checked={toggles.activity}
            disabled={!toggleMap}
            onChange={(event) => {
              // event.preventDefault();
              toggleMap?.("activity", event.target.checked);
            }}
          />{" "}
          Show activity
        </label>
      </p>
      <p>
        <label>
          <input
            type="checkbox"
            checked={toggles.height}
            disabled={!toggleMap}
            onChange={(event) => {
              // event.preventDefault();
              toggleMap?.("height", event.target.checked);
            }}
          />{" "}
          Show contours
        </label>
      </p>
      <p>
        <label>
          <input
            type="checkbox"
            checked={toggles.terrain}
            disabled={!toggleMap}
            onChange={(event) => {
              // event.preventDefault();
              toggleMap?.("terrain", event.target.checked);
            }}
          />{" "}
          Show terrain
        </label>
      </p>
    </MapLayerToggleContainer>
  );
};

const MapLayerToggleContainer = styled(Container)`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 150px;
  line-height: 1;
  pointer-events: all;
`;
