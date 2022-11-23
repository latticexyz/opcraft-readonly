import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { NetworkLayer } from "./layers/network";
import { createNoaLayer } from "./layers/noa";

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

  const { noaLayer, container } =
    useMemo(() => {
      if (!networkLayer) return { noaLayer: null, container: null };
      console.log("got new network layer");

      console.log("creating noa layer");
      const container = createContainer();
      if (parentRef.current) {
        parentRef.current.appendChild(container);
      }
      return {
        noaLayer: createNoaLayer(networkLayer, { domElement: container }),
        container,
      };
    }, [networkLayer]) ?? {};

  useEffect(() => {
    return () => {
      console.log("disposing of old noa layer");
      noaLayer?.world.dispose();
      container?.remove();
    };
  }, [container, noaLayer]);

  useEffect(() => {
    console.log(hidden ? "hiding noa layer" : "showing noa layer");
    if (container) {
      container.hidden = hidden;
    }
    if (noaLayer) {
      noaLayer.noa.setPaused(hidden);
      noaLayer.noa.container.setPointerLock(!hidden);
    }
  }, [container, hidden, noaLayer]);

  const ref = useCallback(
    (el: HTMLElement | null) => {
      console.log("got new noa parent el", el);
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

  return useMemo(() => ({ ref, noaLayer }), [ref, noaLayer]);
};
