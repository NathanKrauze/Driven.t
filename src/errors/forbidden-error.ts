import { ApplicationError } from '@/protocols';

export function forbiddenError(): ApplicationError {
  return {
    name: 'forbiddenError',
    message: 'Outside the business rule!',
  };
}