import React, { useCallback, useEffect, useRef, useState } from "react";
import { NetworkLayer } from "./layers/network";
import { createPhaserLayer, PhaserLayer } from "./layers/phaser";
import { phaserConfig } from "./layers/phaser/config";
import throttle from "lodash/throttle";
import { useResizeObserver, ResizeHandler } from "./useResizeObserver";

// TODO: expose phaser layer to context
// TODO: keep+pause the old phaser instance when spinning up a new one to avoid flash?

// TODO: dynamically generate this ID
const phaserContainerId = "phaser-container";

type Props = {
  networkLayer: NetworkLayer;
  hidden?: boolean;
};

const PhaserContainer = ({ networkLayer, hidden = false }: Props) => {
  const layerRef = useRef<Promise<PhaserLayer> | null>(null);

  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  // I would have expected useResizeObserver to cache this, but throttling shows
  // that the callback just gets overwritten each time, bypassing the throttle.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!layerRef.current) return;
    console.log(hidden ? "hiding phaser layer" : "showing phaser layer");
    layerRef.current.then((layer) => {
      layer.game.canvas.hidden = hidden;
      if (hidden) {
        layer.scenes.Main.input.disableInput();
      } else {
        layer.scenes.Main.input.enableInput();
      }
    });
  }, [hidden]);

  useEffect(() => {
    if (hidden) return;
    layerRef.current?.then((phaserLayer) => {
      // Phaser has a game option that should automatically fit to its parent
      // Not sure why its not working, so we're simulating it here
      console.log("resizing phaser to", width, height);
      phaserLayer.game.scale.resize(width, height);
    });
  }, [width, height, hidden]);

  useEffect(() => {
    if (layerRef.current) {
      console.log("disposing of existing phaser layer");
      layerRef.current.then((phaserLayer) => {
        phaserLayer.world.dispose();
      });
    }
    console.log("creating phaser layer");
    layerRef.current = createPhaserLayer(networkLayer, {
      ...phaserConfig,
      scale: {
        ...phaserConfig.scale,
        parent: phaserContainerId,
        width,
        height,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkLayer]);

  return (
    <div
      ref={ref}
      id={phaserContainerId}
      style={{ width: "100%", height: "100%", pointerEvents: "all" }}
      hidden={hidden}
    ></div>
  );
};

const MemoizedPhaserContainer = React.memo(PhaserContainer);
export { MemoizedPhaserContainer as PhaserContainer };
