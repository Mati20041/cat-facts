import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../providers/AuthenticationProvider';
import { routes } from '../routing';
import { Colors } from '../colors';
import { cssButton } from './StyledParts';

export const Navigation = () => {
  const { user } = useAuthentication();

  return (
    <StyledNavigation>
      <Link to="/">
        <h2>Cat Facts 🐱</h2>
      </Link>
      {user == null ? (
        <div>
          <StyledNavigationLink to={routes.signin}>Signin</StyledNavigationLink>
          <StyledNavigationLink to={routes.signup}>Signup</StyledNavigationLink>
        </div>
      ) : (
        <div>Logged user: {user.username}</div>
      )}
    </StyledNavigation>
  );
};

const StyledNavigation = styled.nav`
  position: sticky;
  top: 0;
  display: flex;
  height: 3rem;
  padding: 0 1rem;
  align-items: center;
  border-bottom: ${Colors.navLine} 2px solid;
  justify-content: space-between;
  background-color: ${Colors.navBackground};

  & div {
    display: flex;
    gap: 0.5rem;
  }
`;

export const StyledNavigationLink = styled(Link)`
  ${cssButton};
`;
