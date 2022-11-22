import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { NetworkLayer } from "./layers/network";
import { createNoaLayer, NoaLayer } from "./layers/noa";

// TODO: keep+pause the old noa instance when spinning up a new one to avoid flash?

const createContainer = () => {
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "all";
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.outline = "none";
  container.appendChild(canvas);
  return container;
};

type Props = {
  networkLayer: NetworkLayer | null;
  hidden?: boolean;
};

export const useNoaLayer = ({ networkLayer, hidden = false }: Props) => {
  const parentRef = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState<{ noaLayer: NoaLayer; container: HTMLElement } | null>(null);

  useEffect(() => {
    if (!networkLayer) return;
    console.log("got new network layer");

    console.log("creating noa layer");
    const container = createContainer();
    if (parentRef.current) {
      parentRef.current.appendChild(container);
    }
    const noaLayer = createNoaLayer(networkLayer, { domElement: container });
    setValue({ noaLayer, container });

    return () => {
      console.log("disposing of noa layer");
      noaLayer.world.dispose();
      container.remove();
    };
  }, [networkLayer]);

  useEffect(() => {
    if (!value) return;
    console.log(hidden ? "hiding noa layer" : "showing noa layer");
    value.noaLayer.noa.setPaused(hidden);
  }, [hidden, value]);

  const ref = useCallback(
    (el: HTMLElement | null) => {
      console.log("got new noa parent el", el);
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

  return useMemo(() => ({ ref, noaLayer: value?.noaLayer }), [ref, value?.noaLayer]);
};
