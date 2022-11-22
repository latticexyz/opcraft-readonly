import React, { useEffect } from "react";
import { useNetworkLayer } from "./useNetworkLayer";
import { PhaserContainer } from "./PhaserContainer";
import { LoadingScreen } from "./LoadingScreen";
import { ViewToggle } from "./ViewToggle";
import { useView } from "./useView";
import { Position } from "./Position";
import styled from "styled-components";
import { JoinSocial } from "./layers/react/components/JoinSocial";
import { MapLayerToggle } from "./MapLayerToggle";
import { useNoaLayer } from "./useNoaLayer";
import { useStore } from "./store";

export const App = () => {
  const networkLayer = useNetworkLayer();
  const [view] = useView();
  const { ref: noaRef, noaLayer } = useNoaLayer({ networkLayer, hidden: view !== "game" });

  useEffect(() => {
    if (noaLayer) {
      useStore.setState({ noaLayer });
    }
  }, [noaLayer]);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <LoadingScreen networkLayer={networkLayer} />

        <Layer ref={noaRef} />

        {networkLayer ? (
          <div
            style={{
              position: "absolute",
              pointerEvents: "none",
              ...(view === "map"
                ? { inset: "0" }
                : {
                    top: "10px",
                    right: "10px",
                    width: "20%",
                    height: "20%",
                  }),
            }}
          >
            <PhaserContainer networkLayer={networkLayer} />
          </div>
        ) : null}

        <Layer style={{ inset: "20px" }}>
          <Socials>
            <JoinSocial />
          </Socials>
          <ViewToggle />
          <Position />
          <MapLayerToggle />
        </Layer>
      </div>
    </>
  );
};

const Socials = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const Layer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;
