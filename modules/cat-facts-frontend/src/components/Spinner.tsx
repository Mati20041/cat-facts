import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;
const StyledSpinner = styled.div`
  width: 10rem;
  height: 10rem;
  background-color: coral;
  border: coral 1px solid;
  border-radius: 3rem;
  animation: ${rotate} 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    font-size: 3rem;
    content: '😺';
  }
`;

export const Spinner = () => <StyledSpinner data-testid="spinner" />;
