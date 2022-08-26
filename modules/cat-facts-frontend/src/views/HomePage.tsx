import React from 'react';
import { useAuthentication } from '../providers/AuthenticationProvider';
import { NotLoggedUser } from '../components/homePage/NotLoggedUser';
import { CatTiles } from '../components/homePage/CatTiles';

export const HomePage = () => {
  const { user } = useAuthentication();
  // This should be a separate view/route with an authentication guard (e. <AuthenticatedRoute .../>)instead of having this logic over here
  if (user?.username == null) {
    return <NotLoggedUser />;
  }
  return <CatTiles />;
};
