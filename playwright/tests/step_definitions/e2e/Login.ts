import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import LoginPage from '../../../pages/LoginPage.ts';

const { Given, When, Then } = createBdd();

Given('el usuario abre la web de Practicas', async ({ page }) => {
  const url: string = process.env.URL || '';
  const login = new LoginPage(page);
  await login.navigateTo(url);
});

When('ingresa el usuario {string}', async ({ page }, username: string) => {
  const login = new LoginPage(page);
  await login.usernameInput.fill(username);
});

When('ingresa la contraseña {string}', async ({ page }, password: string) => {
  const login = new LoginPage(page);
  await login.passwordInput.fill(password);
});

When('el usuario hace clic en el botón ingresar', async ({ page }) => {
  const login = new LoginPage(page);
  await login.submitButton.click();
});

Then('el sistema muestra el mensaje de error {string}', async ({ page }, expectedError: string) => {
  const login = new LoginPage(page);
  await expect(login.getErrorMessage()).toHaveText(expectedError);
});