import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NetworkLayer } from "./layers/network";
import { createPhaserLayer, PhaserLayer } from "./layers/phaser";
import { phaserConfig } from "./layers/phaser/config";

// TODO: keep+pause the old phaser instance when spinning up a new one to avoid flash?
// TODO: use our own ResizeObserver instead of phaser's native resize on an interval (it's buggy)

const createContainer = () => {
  const container = document.createElement("div");
  container.id = `phaser-container-${Math.random()}`;
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
        parent: container.id,
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

  const ref = useCallback(
    (el: HTMLElement | null) => {
      console.log("got new phaser parent el", el);
      if (el) {
        parentRef.current = el;
        if (value) {
          el.appendChild(value.container);
        }
      } else {
        parentRef.current = null;
        value?.container.remove();
      }
    },
    [value]
  );

  return useMemo(() => ({ ref, phaserLayer: value?.phaserLayer }), [ref, value?.phaserLayer]);
};
