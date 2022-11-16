import React, { useCallback, useEffect, useRef, useState } from "react";
import { NetworkLayer } from "./layers/network";
import { createPhaserLayer, PhaserLayer } from "./layers/phaser";
import { phaserConfig } from "./layers/phaser/config";
import useResizeObserver from "use-resize-observer";
import throttle from "lodash/throttle";

// TODO: expose phaser layer to context
// TODO: keep+pause the old phaser instance when spinning up a new one to avoid flash?

// TODO: dynamically generate this ID
const phaserContainerId = "phaser-container";

// use-resize-observer doesn't export this type for us :(
type ResizeHandler = NonNullable<Required<Parameters<typeof useResizeObserver>>[0]["onResize"]>;

type Props = {
  networkLayer: NetworkLayer;
};

export const PhaserContainer = React.memo((props: Props) => {
  const phaserRef = useRef<Promise<PhaserLayer> | null>(null);

  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  // I would have expected useResizeObserver to cache this, but throttling shows
  // that the callback just gets overwritten each time, bypassing the throttle.
  const onResize = useCallback<ResizeHandler>(
    // debounce instead of throttle?
    throttle(({ width, height }) => {
      setSize({ width: width ?? 0, height: height ?? 0 });
    }, 500),
    []
  );
  const { ref } = useResizeObserver({ onResize });

  console.log("PhaserContainer rendered");

  useEffect(() => {
    phaserRef.current?.then((phaserLayer) => {
      // Phaser has a game option that should automatically fit to its parent
      // Not sure why its not working, so we're simulating it here
      console.log("resizing phaser to", width, height);
      phaserLayer.game.scale.resize(width, height);
    });
  }, [width, height]);

  useEffect(() => {
    if (phaserRef.current) {
      console.log("disposing of existing phaser layer");
      phaserRef.current.then((phaserLayer) => {
        phaserLayer.world.dispose();
      });
    }
    console.log("creating phaser layer");
    phaserRef.current = createPhaserLayer(props.networkLayer, {
      ...phaserConfig,
      scale: {
        ...phaserConfig.scale,
        parent: phaserContainerId,
        width,
        height,
      },
    });
  }, [props]);

  return <div ref={ref} id={phaserContainerId} style={{ width: "100%", height: "100%" }}></div>;
});
