import React from "react";
import { useSearchParams } from "react-router-dom";
import { useNetworkLayer } from "./NetworkLayerContext";
import { NoaContainer } from "./NoaContainer";
import { PhaserContainer } from "./PhaserContainer";

export const App = () => {
  const networkLayer = useNetworkLayer();
  const [params, setParams] = useSearchParams();

  // TODO: better loading state
  if (!networkLayer) return null;

  const view = params.get("view") ?? "map";

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <div style={{ position: "absolute", inset: "0", pointerEvents: "none" }}>
          <NoaContainer networkLayer={networkLayer} hidden={view !== "game"} />
        </div>
        <div style={{ position: "absolute", inset: "0", pointerEvents: "none" }}>
          <PhaserContainer networkLayer={networkLayer} hidden={view !== "map"} />
        </div>
        <div style={{ position: "absolute", top: "10px", left: "10px", background: "#333", padding: "10px" }}>
          <button type="button" disabled={view === "map"} onClick={() => setParams({ view: "map" })}>
            map
          </button>
          <button type="button" disabled={view === "game"} onClick={() => setParams({ view: "game" })}>
            game
          </button>
        </div>
      </div>
    </>
  );
};
