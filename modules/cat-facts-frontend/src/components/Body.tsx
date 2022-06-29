import { Route, Routes } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import { routes } from '../routing';
import { Signup } from '../views/Signup';
import { Signin } from '../views/Signin';
import { HomePage } from '../views/HomePage';

export const Body = () => (
  <StyledBody>
    <Routes>
      <Route path={routes.signup} element={<Signup />} />
      <Route path={routes.signin} element={<Signin />} />
      <Route path={routes.home} element={<HomePage />} />
    </Routes>
  </StyledBody>
);

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: 2rem auto 5rem;
  min-height: 35rem;
`;
