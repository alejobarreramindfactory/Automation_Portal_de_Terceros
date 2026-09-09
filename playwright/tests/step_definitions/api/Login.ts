import { createBdd } from 'playwright-bdd';
import { expect, APIResponse } from '@playwright/test';
import Login from '../../../services/Login.ts';

const { Given, When, Then } = createBdd();
const loginService = new Login();

interface LoginPayload {
  username?: string;
  password?: string;
}

let payload: LoginPayload = {
  username: '', 
  password: ''
};

// Variable con tipo explícito para almacenar la respuesta de la API
let apiResponse: APIResponse;

Given('el usuario tiene acceso a la API de login', async ({ request }) => {
  // Obtenemos la URL base de la aplicación según el entorno desde process.env
});

When('el usuario envia la solicitud de login con credenciales validas', async ({ request }) => {
  const username = process.env.USERNAME_API || '';
  const password = process.env.PASSWORD_API || '';

  payload = {
    username: username,
    password: password
  };

  // Enviamos la solicitud pasando el contexto `request` de Playwright al servicio
  apiResponse = await loginService.postLogin(request, payload);
});

Then('el sistema responde con un código de estado 200', async () => {
  expect(apiResponse.status()).toBe(200);
});