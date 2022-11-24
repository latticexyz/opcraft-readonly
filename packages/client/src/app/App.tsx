import React, { useEffect } from "react";
import { LoadingScreen } from "./ui/LoadingScreen";
import { ViewToggle } from "./ui/ViewToggle";
import { useView } from "./useView";
import { Position } from "./ui/Position";
import styled from "styled-components";
import { JoinSocial } from "./ui/JoinSocial";
import { MapLayerToggle } from "./ui/MapLayerToggle";
import { NoaLayer } from "./NoaLayer";
import { PhaserLayer } from "./PhaserLayer";
import { Container } from "./ui/Container";
import { useStore } from "../store";
import { Layer } from "./ui/Layer";
import { useNetworkLayer } from "./useNetworkLayer";

export const App = () => {
  const [view] = useView();
  const networkLayer = useNetworkLayer();

  useEffect(() => {
    if (networkLayer) {
      useStore.setState({ networkLayer });
    }
  }, [networkLayer]);

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
