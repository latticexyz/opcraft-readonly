import React, { useMemo } from "react";
import { BootScreen } from "../../layers/react/engine";
import { getComponentValue } from "@latticexyz/recs";
import { GodID, SyncState } from "@latticexyz/network";
import styled from "styled-components";
import { LoadingBar } from "../../layers/react/components/common";
import { NetworkLayer } from "../../layers/network";
import { concat, map } from "rxjs";
import { useObservable } from "../../useObservable";

type Props = {
  networkLayer: NetworkLayer | null;
};

export const LoadingScreen = ({ networkLayer }: Props) => {
  const loadingState = useObservable(
    useMemo(() => {
      if (!networkLayer) return;

      const {
        components: { LoadingState },
        world,
      } = networkLayer;

      // use LoadingState.update$ as a trigger rather than a value
      // and concat with an initial value to trigger the first look up
      return concat([1], LoadingState.update$).pipe(
        map(() => {
          // and then look up the current value
          const GodEntityIndex = world.entityToIndex.get(GodID);
          const loadingState = GodEntityIndex == null ? null : getComponentValue(LoadingState, GodEntityIndex);
          return loadingState ?? null;
        })
      );
    }, [networkLayer])
  ) ?? { msg: "Connecting...", percentage: 0, state: SyncState.CONNECTING };

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
