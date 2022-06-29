import styled from 'styled-components';

export const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  max-width: 25rem;

  & h2 {
    grid-column: span 2;
  }
`;
export const StyledErrorMessage = styled.div`
  color: red;
  grid-column: span 2;
  margin: 1rem 0;
`;
export const StyledValidationError = styled.span`
  display: flex;
  flex-direction: column;

  & div {
    height: 1em;
    color: red;
    font-size: 10px;
  }
`;
export const StyledButtonGroup = styled.div`
  grid-column: span 2;
`;
