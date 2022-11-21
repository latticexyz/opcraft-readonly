import { ActionState } from "@latticexyz/std-client";
import React from "react";
import styled from "styled-components";
import { ActionStatusIcon } from "../Action";
import { Container } from "./Container";

type Props = {
  onClose?: () => void;
  children: React.ReactNode;
};

export const CloseableContainer = ({ onClose, children }: Props) => {
  return (
    <RelativeContainer>
      {onClose && (
        <CloseButton onClick={onClose}>
          <ActionStatusIcon state={ActionState.Failed} />
        </CloseButton>
      )}
      <>{children}</>
    </RelativeContainer>
  );
};

const RelativeContainer = styled(Container)`
  position: relative;
`;

const CloseButton = styled.div`
  position: absolute;
  right: 3px;
  top: 3px;
  cursor: pointer;

  svg {
    width: 1em;
    height: 1em;
    color: #9c9c9c;

    :hover {
      color: hsl(0, 60%, 60%);
    }
  }
`;
