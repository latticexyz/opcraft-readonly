import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NetworkLayer } from "../layers/network";
import { createPhaserLayer } from "../layers/phaser";
import { phaserConfig } from "../layers/phaser/config";
import useResizeObserver, { ResizeHandler } from "use-resize-observer";
import { throttle } from "lodash";
import { usePromiseValue } from "../usePromiseValue";
import { debug as parentDebug } from "../debug";

const debug = parentDebug.extend("usePhaserLayer");

const createContainer = () => {
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "all";
  return container;
};

type Props = {
  networkLayer: NetworkLayer | null;
  containerId?: string;
  hidden?: boolean;
};

export const usePhaserLayer = ({ networkLayer, hidden = false }: Props) => {
  const parentRef = useRef<HTMLElement | null>(null);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  const { phaserLayerPromise, container } = useMemo(() => {
    if (!networkLayer) return { phaserLayerPromise: null, container: null };
    debug("got new network layer");

    debug("creating phaser layer");
    const container = createContainer();
    if (parentRef.current) {
      parentRef.current.appendChild(container);
    }
    return {
      container,
      phaserLayerPromise: createPhaserLayer(networkLayer, {
        ...phaserConfig,
        scale: {
          ...phaserConfig.scale,
          parent: container,
          // Phaser's default resize handling isn't great, so we'll do our own
          // TODO: make a Phaser PR for this?
          mode: Phaser.Scale.NONE,
          width,
          height,
        },
      }),
    };

    // We don't want width/height to recreate phaser layer, so we ignore linter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkLayer]);

  useEffect(() => {
    return () => {
      debug("disposing of old phaser layer");
      phaserLayerPromise?.then((phaserLayer) => phaserLayer.world.dispose());
      container?.remove();
    };
  }, [container, phaserLayerPromise]);

  const phaserLayer = usePromiseValue(phaserLayerPromise);

  useEffect(() => {
    debug(hidden ? "hiding phaser layer" : "showing phaser layer");
    if (container) {
      container.hidden = hidden;
    }
    if (phaserLayer) {
      if (hidden) {
        phaserLayer.scenes.Main.input.disableInput();
      } else {
        phaserLayer.scenes.Main.input.enableInput();
      }
    }
  }, [container, hidden, phaserLayer]);

  const onResize = useMemo<ResizeHandler>(() => {
    debug("setting up on resize");
    return throttle(({ width, height }) => {
      debug("size changed, updating state,", width, height);
      setSize({ width: width ?? 0, height: height ?? 0 });
    }, 500);
  }, []);
  useResizeObserver({
    ref: container,
    onResize,
  });

  useEffect(() => {
    if (hidden || !phaserLayer) return;
    debug("resizing phaser to", width, height);
    phaserLayer.game.scale.resize(width, height);
  }, [width, height, hidden, phaserLayer]);

  const ref = useCallback(
    (el: HTMLElement | null) => {
      debug("got new phaser parent el", el);
      parentRef.current = el;
      if (container) {
        if (parentRef.current) {
          parentRef.current.appendChild(container);
        } else {
          container.remove();
        }
      }
    },
    [container]
  );

  return useMemo(() => ({ ref, phaserLayer }), [ref, phaserLayer]);
};
