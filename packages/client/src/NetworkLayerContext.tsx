import { createContext, useState, useContext, useEffect } from "react";
import { NetworkLayer } from "./layers/network";

const NetworkLayerContext = createContext<Promise<NetworkLayer> | null>(null);

export const useNetworkLayer = () => {
  const [networkLayer, setNetworkLayer] = useState<NetworkLayer | null>(null);
  const networkLayerPromise = useContext(NetworkLayerContext);
  if (!networkLayerPromise) {
    throw new Error("useNetworkLayer called outside of NetworkLayerProvider");
  }

  useEffect(() => {
    let isMounted = true;
    networkLayerPromise.then((networkLayer) => {
      if (!isMounted) return;
      setNetworkLayer(networkLayer);
    });
    return () => {
      isMounted = false;
    };
  }, [networkLayerPromise]);

  return networkLayer;
};

export const NetworkLayerProvider = NetworkLayerContext.Provider;
