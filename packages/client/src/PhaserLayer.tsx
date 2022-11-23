import React, { useEffect } from "react";
import { useStore } from "./store";
import { usePhaserLayer } from "./usePhaserLayer";
import { NetworkLayer } from "./layers/network";

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
