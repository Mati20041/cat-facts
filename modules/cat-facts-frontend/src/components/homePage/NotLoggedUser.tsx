import styled from 'styled-components';
import React from 'react';
import { StyledCard } from '../StyledCard';
import { StyledNavigationLink } from '../Navigation';

export const NotLoggedUser = () => (
  <StyledHomePage>
    <p>Sorry, you need to be authenticated to see Cat Facts 😿</p>
    <p>
      🐈 Please go to <StyledNavigationLink to="/signin">Signin</StyledNavigationLink> or{' '}
      <StyledNavigationLink to="/signin">Signup</StyledNavigationLink> page 🐈‍⬛
    </p>
  </StyledHomePage>
);

const StyledHomePage = styled(StyledCard)`
  flex-grow: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
