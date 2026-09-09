import { faker } from '@faker-js/faker';

export const generateUserData = () => {
  return {
    username: faker.internet.username(),
    password: faker.internet.password(),
  };
};