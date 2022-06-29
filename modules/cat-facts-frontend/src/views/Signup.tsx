import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { useMutation } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserDto } from '@cat-facts/shared';
import { routes } from '../routing';
import {
  StyledButton,
  StyledButtonGroup,
  StyledCard,
  StyledErrorMessage,
  StyledForm,
  StyledValidationError,
} from '../components/StyledParts';
import { userDtoSchema } from './signin/validation';
import { useAuthentication } from '../providers/AuthenticationProvider';

export const Signup = () => {
  const navigate = useNavigate();
  const { authenticationService } = useAuthentication();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>({ reValidateMode: 'onSubmit', resolver: yupResolver(userDtoSchema) });

  const {
    mutate: signup,
    error,
    isLoading,
  } = useMutation(
    async (data: UserDto) => {
      await authenticationService.signup.bind(authenticationService)(data);
      await authenticationService.signin.bind(authenticationService)(data);
    },
    {
      onSuccess: () => {
        navigate(routes.home);
      },
      onError: (err) => {
        console.error('Error occured while signup', err);
      },
    }
  );

  const onSubmit = handleSubmit((data) => signup(data));

  return (
    <StyledSignup>
      <StyledForm onSubmit={onSubmit}>
        <>
          <h2>Signup Form</h2>
          {error && (
            <StyledErrorMessage>
              An error occurred during account creation. Please try again or contact Administrator.
            </StyledErrorMessage>
          )}
          <label htmlFor="username">Username: </label>
          <StyledValidationError>
            <input id="username" {...register('username')} />
            <div>
              <ErrorMessage errors={errors} name="username" />
            </div>
          </StyledValidationError>
          <label htmlFor="password">Password: </label>
          <StyledValidationError>
            <input id="password" type="password" {...register('password')} />
            <div>
              <ErrorMessage errors={errors} name="password" />
            </div>
          </StyledValidationError>
          <StyledButtonGroup>
            <StyledButton type="submit" disabled={isLoading}>
              Sign Up
            </StyledButton>
          </StyledButtonGroup>
        </>
      </StyledForm>
    </StyledSignup>
  );
};

const StyledSignup = styled(StyledCard)`
  margin: auto;
  padding: 2rem;
  justify-content: center;
  text-align: center;
`;
