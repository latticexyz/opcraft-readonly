import { useStore } from "./store";

export const useNetworkLayer = () => {
  // TODO: check and throw if network layer component isn't mounted
  return useStore((state) => state.networkLayer);
};
