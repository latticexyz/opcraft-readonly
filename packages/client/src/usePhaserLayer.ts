import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NetworkLayer } from "./layers/network";
import { createPhaserLayer, PhaserLayer } from "./layers/phaser";
import { phaserConfig } from "./layers/phaser/config";
import useResizeObserver, { ResizeHandler } from "use-resize-observer";
import { throttle } from "lodash";

// TODO: keep+pause the old phaser instance when spinning up a new one to avoid flash?

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
  const [value, setValue] = useState<{ phaserLayer: PhaserLayer; container: HTMLElement } | null>(null);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!networkLayer) return;
    console.log("got new network layer");

    console.log("creating phaser layer");
    const container = createContainer();
    if (parentRef.current) {
      parentRef.current.appendChild(container);
    }
    const phaserLayerPromise = createPhaserLayer(networkLayer, {
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
    });
    phaserLayerPromise.then((phaserLayer) => setValue({ phaserLayer, container }));

    return () => {
      console.log("disposing of phaser layer");
      phaserLayerPromise.then((phaserLayer) => phaserLayer.world.dispose());
      container.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkLayer]);

  useEffect(() => {
    if (!value) return;
    console.log(hidden ? "hiding phaser layer" : "showing phaser layer");
    value.phaserLayer.game.canvas.hidden = hidden;
    if (hidden) {
      value.phaserLayer.scenes.Main.input.disableInput();
    } else {
      value.phaserLayer.scenes.Main.input.enableInput();
    }
  }, [hidden, value]);

  const onResize = useMemo<ResizeHandler>(() => {
    console.log("setting up on resize");
    return throttle(({ width, height }) => {
      console.log("size changed, updating state,", width, height);
      setSize({ width: width ?? 0, height: height ?? 0 });
    }, 500);
  }, []);
  useResizeObserver({
    ref: value?.container,
    onResize,
  });

  useEffect(() => {
    if (hidden || !value) return;
    console.log("resizing phaser to", width, height);
    value.phaserLayer.game.scale.resize(width, height);
  }, [width, height, hidden, value]);

  const ref = useCallback(
    (el: HTMLElement | null) => {
      console.log("got new phaser parent el", el);
      parentRef.current = el;
      if (value) {
        if (parentRef.current) {
          parentRef.current.appendChild(value.container);
        } else {
          value.container.remove();
        }
      }
    },
    [value]
  );

  return useMemo(() => ({ ref, phaserLayer: value?.phaserLayer }), [ref, value?.phaserLayer]);
};
