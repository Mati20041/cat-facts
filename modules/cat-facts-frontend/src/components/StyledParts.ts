import styled, { css } from 'styled-components';
import { Colors } from '../colors';

export const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  width: 25rem;

  & h2 {
    grid-column: span 2;
  }
`;
export const StyledErrorMessage = styled.div`
  color: ${Colors.error};
  grid-column: span 2;
  margin: 1rem 0;
`;
export const StyledValidationError = styled.span`
  display: flex;
  flex-direction: column;

  & div {
    height: 1em;
    color: ${Colors.error};
    font-size: 10px;
  }
`;
export const StyledButtonGroup = styled.div`
  grid-column: span 2;
`;
export const StyledCard = styled.div`
  display: flex;
  box-shadow: ${Colors.shadow} 10px 10px 15px;
`;
export const cssButton = css`
  font-weight: bold;
  border: 1px solid ${Colors.shadow};
  border-radius: 3px;
  padding: 0.25rem;
`;
export const StyledButton = styled.button`
  font-size: 1rem;
  ${cssButton};
  background-color: ${Colors.white};
`;
