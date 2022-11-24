import React, { useEffect } from "react";
import { useNoaLayer } from "./useNoaLayer";
import { useStore } from "../store";
import { NetworkLayer } from "../layers/network";

// We isolate the `useNoaLayer` hook in its own component so that HMR
// somewhere in the Noa layer doesn't trigger the whole app to re-render.

type Props = {
  networkLayer: NetworkLayer | null;
  hidden?: boolean;
};

export const NoaLayer = ({ networkLayer, hidden }: Props) => {
  const { ref: noaRef, noaLayer } = useNoaLayer({ networkLayer, hidden });

  useEffect(() => {
    if (noaLayer) {
      useStore.setState({ noaLayer });
    }
  }, [noaLayer]);

  return <div ref={noaRef} style={{ width: "100%", height: "100%" }} />;
};
