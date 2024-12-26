import { type User } from '@/models/user.model';

export const removePasswordField = (user: Partial<User>) => {
  return Object.fromEntries(Object.entries(user).filter(([key]) => key !== 'password'));
};
