import React, { useMemo } from "react";
import { map, concat, of } from "rxjs";
import styled from "styled-components";
import { Container } from "../../layers/react/components/common";
import { getComponentValue } from "@latticexyz/recs";
import { useStore } from "../../store";
import { useObservable } from "../../useObservable";
import { filterNullish } from "@latticexyz/utils";

export const MapLayerToggle = () => {
  const networkLayer = useStore((state) => state.networkLayer);
  const phaserLayer = useStore((state) => state.phaserLayer);
  const toggles = useObservable(
    useMemo(() => {
      if (!networkLayer || !phaserLayer) return;

      const {
        components: { UI },
      } = phaserLayer;
      const { SingletonEntity } = networkLayer;

      return concat(of(getComponentValue(UI, SingletonEntity)), UI.update$.pipe(map((update) => update.value[0]))).pipe(
        filterNullish()
      );
    }, [networkLayer, phaserLayer])
  ) ?? { activity: false, height: false, terrain: false };

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
  right: 0;
  bottom: 0;
  width: 150px;
  line-height: 1;
  pointer-events: all;
`;
