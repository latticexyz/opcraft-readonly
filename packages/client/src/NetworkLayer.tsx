import React, { useEffect } from "react";
import { useStore } from "./store";
import { useNetworkLayer } from "./useNetworkLayer";

type Props = {
  children?: React.ReactNode;
};

export const NetworkLayer = ({ children }: Props) => {
  const networkLayer = useNetworkLayer();

  useEffect(() => {
    if (networkLayer) {
      useStore.setState({ networkLayer });
    }
  }, [networkLayer]);

  return children == null ? null : <>{children}</>;
};
