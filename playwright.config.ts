const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');
const dotenv = require('dotenv');
const path = require('path');

// Lee el ambiente pasado por terminal (ej. ENV=dev), por defecto usa 'dev'
const environment = (process.env.ENV || 'dev').toLowerCase();

// Apunta explícitamente a la subcarpeta environments/
dotenv.config({ path: path.resolve(__dirname, 'environments', `.env.${environment}`) });

// Configuración de rutas para BDD / Cucumber
const testDir = defineBddConfig({
  features: 'playwright/tests/features/**/*.feature',
  steps: [
    'playwright/tests/step_definitions/**/*.ts'
  ],
});

module.exports = defineConfig({
  testDir,
  
  use: {
    // Configura la URL base usando la variable de entorno cargada
    baseURL: process.env.URL,
    viewport: { width: 1920, height: 1080 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});