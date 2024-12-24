import { type User } from '@/models/user.model';

export const removePasswordField = (user: User) => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== 'password'),
  );
};
