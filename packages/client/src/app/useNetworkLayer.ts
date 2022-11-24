import React, { useEffect, useMemo } from "react";
import { createNetworkLayer, GameConfig } from "../layers/network";
import { useSearchParams } from "react-router-dom";
import { getBurnerWallet } from "../getBurnerWallet";
import { usePromiseValue } from "../usePromiseValue";
import { debug as parentDebug } from "../debug";

const debug = parentDebug.extend("useNetworkLayer");

const networkDefaults: Omit<GameConfig, "privateKey" | "devMode"> = {
  chainId: 64657,
  worldAddress: "0x3031a86EFA3A9c0B41EA089F2021C6490591fB8c",
  initialBlockNumber: 4146,
  jsonRpc: "https://opcraft-3-replica-0.bedrock-goerli.optimism.io",
  wsRpc: "wss://opcraft-3-replica-0.bedrock-goerli.optimism.io/ws",
  snapshotUrl: "https://ecs-snapshot.opcraft-mud-services.lattice.xyz",
  streamServiceUrl: "https://ecs-stream.opcraft-mud-services.lattice.xyz",
  relayServiceUrl: "https://ecs-relay.opcraft-mud-services.lattice.xyz",
  faucetServiceUrl: "https://faucet.opcraft-mud-services.lattice.xyz",
  blockTime: 1000,
  blockExplorer: "https://blockscout.com/optimism/opcraft",
};

export const useNetworkLayer = () => {
  const [params] = useSearchParams();

  const worldAddress = params.get("worldAddress") ?? networkDefaults.worldAddress;
  const chainId = parseInt(params.get("chainId") ?? "") || networkDefaults.chainId;
  const jsonRpc = params.get("rpc") ?? networkDefaults.jsonRpc;
  const wsRpc = params.get("wsRpc") ?? networkDefaults.wsRpc;
  const snapshotUrl = params.get("snapshot") ?? networkDefaults.snapshotUrl;
  const streamServiceUrl = params.get("stream") ?? networkDefaults.streamServiceUrl;
  const relayServiceUrl = params.get("relay") ?? networkDefaults.relayServiceUrl;
  const faucetServiceUrl = params.get("faucet") ?? networkDefaults.faucetServiceUrl;
  const devMode = params.get("dev") === "true";
  const initialBlockNumber = parseInt(params.get("initialBlockNumber") ?? "") || networkDefaults.initialBlockNumber;
  const blockTime = parseInt(params.get("blockTime") ?? "") || networkDefaults.blockTime;
  const blockExplorer = params.get("blockExplorer") ?? networkDefaults.blockExplorer;

  // TODO: make this reactive?
  const privateKey = getBurnerWallet();

  if (!worldAddress) throw new Error("Missing world address");
  if (!chainId) throw new Error("Missing chain ID");
  if (!jsonRpc) throw new Error("Missing RPC URL");
  // TODO: any other checks to do?

  const networkLayerPromise = useMemo(() => {
    debug("creating network layer");
    return createNetworkLayer({
      privateKey,
      worldAddress,
      chainId,
      jsonRpc,
      wsRpc,
      snapshotUrl,
      streamServiceUrl,
      relayServiceUrl,
      faucetServiceUrl,
      devMode,
      blockTime,
      initialBlockNumber,
      blockExplorer,
    });
  }, [
    blockExplorer,
    blockTime,
    chainId,
    devMode,
    faucetServiceUrl,
    initialBlockNumber,
    jsonRpc,
    privateKey,
    relayServiceUrl,
    snapshotUrl,
    streamServiceUrl,
    worldAddress,
    wsRpc,
  ]);

  useEffect(() => {
    return () => {
      debug("disposing of old network layer");
      networkLayerPromise.then((networkLayer) => networkLayer.world.dispose());
    };
  }, [networkLayerPromise]);

  return usePromiseValue(networkLayerPromise);
};
