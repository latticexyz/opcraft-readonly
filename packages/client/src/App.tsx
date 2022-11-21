import React from "react";
import { useNetworkLayer } from "./useNetworkLayer";
import { NoaContainer } from "./NoaContainer";
import { PhaserContainer } from "./PhaserContainer";
import { LoadingScreen } from "./LoadingScreen";
import { ViewToggle } from "./ViewToggle";
import { useView } from "./useView";
import { Position } from "./Position";
import styled from "styled-components";
import { JoinSocial } from "./layers/react/components/JoinSocial";
import { MapLayerToggle } from "./MapLayerToggle";

export const App = () => {
  const networkLayer = useNetworkLayer();
  const [view] = useView();

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <LoadingScreen networkLayer={networkLayer} />
        {networkLayer ? (
          <>
            <div style={{ position: "absolute", inset: "0", pointerEvents: "none" }}>
              <NoaContainer networkLayer={networkLayer} hidden={view !== "game"} />
            </div>
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

            <Socials>
              <JoinSocial />
            </Socials>
            <ViewToggle />
            <Position />
            <MapLayerToggle />
          </>
        ) : null}
      </div>
    </>
  );
};

const Socials = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`;
