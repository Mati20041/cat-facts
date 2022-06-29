import React from 'react';
import styled from 'styled-components';

export const Footer = () => <StyledFooter>Copyright 2022 @ Mati20041</StyledFooter>;

const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  height: 3rem;
  text-align: center;
  border-top: #61dafb 2px solid;
  background-color: azure;
  width: 100%;
  padding: 0.5rem 1rem 0;
`;
