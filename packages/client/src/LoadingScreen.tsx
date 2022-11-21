import React from "react";
import { BootScreen } from "./layers/react/engine";
import { ComponentValue, getComponentValue, SchemaOf } from "@latticexyz/recs";
import { GodID, SyncState } from "@latticexyz/network";
import styled from "styled-components";
import { LoadingBar } from "./layers/react/components/common";
import { NetworkLayer } from "./layers/network";
import { concat } from "rxjs";

type Props = {
  networkLayer: NetworkLayer | null;
};

const useLoadingState = (networkLayer: NetworkLayer) => {
  const {
    components: { LoadingState },
    world,
  } = networkLayer;

  const [value, setValue] = React.useState<ComponentValue<SchemaOf<typeof LoadingState>> | null>(null);
  React.useEffect(() => {
    // use LoadingState.update$ as a trigger rather than a value
    // and concat with an initial value to trigger the first look up
    const subscription = concat([1], LoadingState.update$).subscribe(() => {
      // and then look up the current value
      const GodEntityIndex = world.entityToIndex.get(GodID);
      const loadingState = GodEntityIndex == null ? null : getComponentValue(LoadingState, GodEntityIndex);
      setValue(loadingState ?? null);
    });
    return () => subscription.unsubscribe();
  }, [LoadingState, world]);

  return value;
};

export const LoadingScreen = ({ networkLayer }: Props) => {
  if (!networkLayer) {
    return <BootScreen initialOpacity={1}>Connecting</BootScreen>;
  }
  return <LoadingScreenWithNetworkLayer networkLayer={networkLayer} />;
};

export const LoadingScreenWithNetworkLayer = ({ networkLayer }: { networkLayer: NetworkLayer }) => {
  const loadingState = useLoadingState(networkLayer);
  if (loadingState == null) {
    return <BootScreen initialOpacity={1}>Connecting</BootScreen>;
  }
  if (loadingState.state === SyncState.LIVE) {
    return null;
  }
  return (
    <BootScreen initialOpacity={1}>
      {loadingState.msg}
      <LoadingContainer>
        {Math.floor(loadingState.percentage)}%<Loading percentage={loadingState.percentage} />
      </LoadingContainer>
    </BootScreen>
  );
};

const LoadingContainer = styled.div`
  display: grid;
  justify-items: start;
  justify-content: start;
  align-items: center;
  height: 30px;
  width: 100%;
  grid-gap: 20px;
  grid-template-columns: auto 1fr;
`;

const Loading = styled(LoadingBar)`
  width: 100%;
  min-width: 200px;
`;
