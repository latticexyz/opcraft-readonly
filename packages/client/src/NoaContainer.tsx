import React, { useEffect, useRef } from "react";
import { NetworkLayer } from "./layers/network";
import { createNoaLayer, NoaLayer } from "./layers/noa";

// TODO: expose noa layer to context
// TODO: keep+pause the old noa instance when spinning up a new one to avoid flash?

type Props = {
  networkLayer: NetworkLayer;
  hidden?: boolean;
};

const NoaContainer = ({ networkLayer, hidden }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<NoaLayer | null>(null);

  console.log("NoaContainer rendered");

  useEffect(() => {
    console.log("got new network layer");
    if (!containerRef.current) {
      throw new Error(
        "NoaContainer ref was not set before useEffect, this is unexpected for the React version this was built with"
      );
    }

    if (layerRef.current) {
      console.log("disposing of existing noa layer");
      layerRef.current.world.dispose();
    }
    console.log("creating noa layer");
    // TODO: make noa layer async?
    layerRef.current = createNoaLayer(networkLayer, { domElement: containerRef.current });
    layerRef.current.noa.setPaused(hidden);
    // TODO: yuck, revisit this
    window.layers = {
      ...(window.layers ?? {}),
      noa: layerRef.current,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkLayer]);

  useEffect(() => {
    if (!layerRef.current) return;
    console.log(hidden ? "hiding phaser layer" : "showing phaser layer");
    layerRef.current.noa.setPaused(hidden);
  }, [hidden]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", pointerEvents: "all" }} hidden={hidden}>
      <canvas style={{ width: "100%", height: "100%", outline: "none" }} />
    </div>
  );
};

const MemoizedNoaContainer = React.memo(NoaContainer);
export { MemoizedNoaContainer as NoaContainer };
