import * as yup from 'yup';
import { UserDto } from '@cat-facts/shared';

export const userDtoSchema: yup.SchemaOf<UserDto> = yup.object().shape({
  username: yup.string().min(2).max(30).required(),
  password: yup.string().min(2).max(30).required(),
});
