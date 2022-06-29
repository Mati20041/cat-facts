import React from 'react';
import { useAuthentication } from '../providers/AuthenticationProvider';
import { NotLoggedUser } from '../components/homePage/NotLoggedUser';
import { CatTiles } from '../components/homePage/CatTiles';

export const HomePage = () => {
  const { user } = useAuthentication();
  if (user?.username == null) {
    return <NotLoggedUser />;
  }
  return <CatTiles />;
};
