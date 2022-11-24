import React, { useEffect } from "react";
import { useStore } from "../store";
import { usePhaserLayer } from "./usePhaserLayer";
import { NetworkLayer } from "../layers/network";

// We isolate the `usePhaserHook` hook in its own component so that HMR
// somewhere in the Phaser layer doesn't trigger the whole app to re-render.
//
// A render prop is used for children so that we can move Phaser into
// different containers depending on the view being requested, while still
// maintaining a stable reference to the Phaser layer.

type Props = {
  networkLayer: NetworkLayer | null;
  hidden?: boolean;
  children: (phaserLayer: React.ReactNode) => React.ReactNode;
};

export const PhaserLayer = ({ networkLayer, hidden, children }: Props) => {
  const { ref: phaserRef, phaserLayer } = usePhaserLayer({ networkLayer, hidden });

  useEffect(() => {
    if (phaserLayer) {
      useStore.setState({ phaserLayer });
    }
  }, [phaserLayer]);

  return <>{children(<div ref={phaserRef} style={{ width: "100%", height: "100%" }} />)}</>;
};
