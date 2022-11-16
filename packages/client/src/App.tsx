import React from "react";
import { useSearchParams } from "react-router-dom";
import { useNetworkLayer } from "./NetworkLayerContext";
import { NoaContainer } from "./NoaContainer";
import { PhaserContainer } from "./PhaserContainer";

export const App = () => {
  const networkLayer = useNetworkLayer();
  const [params] = useSearchParams();

  // TODO: better loading state
  if (!networkLayer) return null;

  const view = params.get("view") ?? "map";

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <div style={{ position: "absolute", inset: "0" }}>
          <NoaContainer networkLayer={networkLayer} hidden={view !== "game"} />
        </div>
        <div style={{ position: "absolute", inset: "0" }}>
          <PhaserContainer networkLayer={networkLayer} hidden={view !== "map"} />
        </div>
      </div>
    </>
  );
};
