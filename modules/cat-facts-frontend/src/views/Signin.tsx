import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import { StyledCard } from '../components/StyledCard';
import { useAuthentication, UserDto } from '../providers/AuthenticationProvider';
import { routes } from '../routing';
import {
  StyledButtonGroup,
  StyledErrorMessage,
  StyledForm,
  StyledValidationError,
} from './signin/StyledParts';
import { userDtoSchema } from './signin/validation';

export const Signin = () => {
  const navigate = useNavigate();
  const { authenticationService } = useAuthentication();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>({ reValidateMode: 'onSubmit', resolver: yupResolver(userDtoSchema) });

  const {
    mutate: signin,
    error,
    isLoading,
  } = useMutation(authenticationService.signin.bind(authenticationService), {
    onSuccess: (token) => {
      navigate(routes.home);
    },
    onError: (err) => {
      console.error('Error occured while signin', err);
    },
  });
  const onSubmit = handleSubmit((data) => signin(data));

  return (
    <StyledSignin>
      <StyledForm onSubmit={onSubmit}>
        <>
          <h2>Signin Form</h2>
          {error && <StyledErrorMessage>{extractErrorMessage(error)}</StyledErrorMessage>}
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
            <button type="submit" disabled={isLoading}>
              Sign In
            </button>
          </StyledButtonGroup>
        </>
      </StyledForm>
    </StyledSignin>
  );
};

const extractErrorMessage = (error: unknown) => {
  return error instanceof AxiosError && error.response?.status === 401
    ? 'Wrong Credentials. Please try again or contact Administrator.'
    : 'An error occurred during signing. Please try again or contact Administrator.';
};

const StyledSignin = styled(StyledCard)`
  margin: auto;
  padding: 2rem;
  justify-content: center;
  text-align: center;
`;
