import React, { useRef } from "react";
import { useNetworkLayer } from "./NetworkLayerContext";
import { PhaserContainer } from "./PhaserContainer";

export const App = () => {
  const networkLayer = useNetworkLayer();
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (ref.current) {
            const size = Math.floor(Math.random() * 600) + 300;
            ref.current.style.width = `${size}px`;
            ref.current.style.height = `${size}px`;
          }
        }}
      >
        resize
      </button>
      <div ref={ref} style={{ width: "300px", height: "300px" }}>
        {networkLayer ? <PhaserContainer networkLayer={networkLayer} /> : null}
      </div>
    </>
  );
};
