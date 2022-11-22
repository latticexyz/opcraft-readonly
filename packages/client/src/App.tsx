import React from "react";
import { useNetworkLayer } from "./useNetworkLayer";
import { LoadingScreen } from "./LoadingScreen";
import { ViewToggle } from "./ViewToggle";
import { useView } from "./useView";
import { Position } from "./Position";
import styled from "styled-components";
import { JoinSocial } from "./layers/react/components/JoinSocial";
import { MapLayerToggle } from "./MapLayerToggle";
import { NoaLayer } from "./NoaLayer";
import { PhaserLayer } from "./PhaserLayer";
import { Container } from "./layers/react/components/common";

export const App = () => {
  const networkLayer = useNetworkLayer();
  const [view] = useView();

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <LoadingScreen networkLayer={networkLayer} />

        <Layer>
          <NoaLayer networkLayer={networkLayer} hidden={view !== "game"} />
        </Layer>

        <PhaserLayer networkLayer={networkLayer}>
          {(phaserLayer) =>
            view === "map" ? (
              <Layer>{phaserLayer}</Layer>
            ) : (
              <div style={{ position: "absolute", right: "20px", top: "20px" }}>
                <Container style={{ width: "20vmin", height: "20vmin" }}>{phaserLayer}</Container>
              </div>
            )
          }
        </PhaserLayer>

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
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
`;

const Layer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;
