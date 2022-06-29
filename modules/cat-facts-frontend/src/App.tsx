import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { AuthenticationProvider } from './providers/AuthenticationProvider';
import { Footer } from './components/Footer';
import { Body } from './components/Body';
import { AppQueryProvider } from './providers/AppQueryProvider';

const App = () => (
  <AppQueryProvider>
    <BrowserRouter>
      <AuthenticationProvider>
        <Navigation />
        <Body />
        <Footer />
      </AuthenticationProvider>
    </BrowserRouter>
  </AppQueryProvider>
);

export default App;
