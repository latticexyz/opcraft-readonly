import React, { useRef } from "react";
import { useNetworkLayer } from "./NetworkLayerContext";
import { PhaserContainer } from "./PhaserContainer";

export const App = () => {
  const networkLayer = useNetworkLayer();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {networkLayer ? <PhaserContainer networkLayer={networkLayer} /> : null}
    </div>
  );
};
