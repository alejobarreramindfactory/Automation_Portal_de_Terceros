import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import SuccessPage from '../../../pages/SuccessPage.ts';

const { Then } = createBdd();

Then('el sistema muestra el mensaje {string}', async ({ page }, expectedMessage: string) => {
  const successPage = new SuccessPage(page);

  // Verificamos que el mensaje mostrado sea el esperado
  await expect(successPage.getMessage()).toHaveText(expectedMessage);
});

Then('el sistema muestra el titulo {string}', async ({ page }, expectedTitle: string) => {
  const successPage = new SuccessPage(page);

  // Verificamos que el título mostrado sea el esperado
  await expect(successPage.getTitle()).toHaveText(expectedTitle);
});