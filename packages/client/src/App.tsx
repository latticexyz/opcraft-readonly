import React, { useEffect, useRef, useState } from "react";
import { createNetworkLayer, NetworkLayer } from "./layers/network";
import { PhaserContainer } from "./PhaserContainer";

const networkLayerPromise = createNetworkLayer({
  // TODO
});

export const App = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [networkLayer, setNetworkLayer] = useState<NetworkLayer | null>(null);

  useEffect(() => {
    networkLayerPromise.then(setNetworkLayer);
  }, []);

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
