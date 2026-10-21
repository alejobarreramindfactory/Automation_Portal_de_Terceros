# Playwright BDD TypeScript Framework

Framework de automatización de pruebas BDD para UI y API desarrollado con Playwright, TypeScript y `playwright-bdd`. Cuenta con integración a servidor MCP (Model Context Protocol) para interacción asistida por IA.

## 🛠️ Tecnologías y Herramientas

* **Lenguaje:** TypeScript (ES2022 / NodeNext)
* **Test Runner & BDD:** Playwright Test + `playwright-bdd` (Cucumber syntax)
* **Patrón de Diseño:** Page Object Model (POM) para UI y API Services para peticiones HTTP
* **Asistencia IA:** MCP Server integrado para Roo Code

## 📁 Estructura del Proyecto

```text
├── .features-gen/            # Tests autogenerados por playwright-bdd
├── environments/             # Variables de entorno (.env.dev, .env.tst)
├── mcp-server.ts             # Servidor MCP de Playwright para agentes de IA
├── playwright/
│   ├── pages/                # Page Objects (POM)
│   ├── services/             # Servicios para pruebas de API
│   ├── support/              # Hooks y configuraciones globales
│   ├── tests/
│   │   ├── features/         # Archivos BDD (.feature)
│   │   └── step_definitions/ # Step definitions en TypeScript (.ts)
│   └── utils/                # Generadores de datos y utilitarios
├── playwright.config.ts      # Configuración principal de Playwright
└── tsconfig.json             # Configuración de compilación TypeScript

🚀 Instalación y Configuración
Clonar el repositorio e instalar dependencias:

Bash
npm install
Instalar los navegadores de Playwright:

Bash
npx playwright install
🧪 Ejecución de Pruebas
Para compilar las features BDD y ejecutar la suite completa:

Bash
npm run test
🤖 Integración MCP con Roo Code
El proyecto incluye un servidor MCP local para permitir que herramientas como Roo Code exploren y ejecuten acciones en el navegador.

Ejecución local del servidor MCP:

Bash
npm run mcp-server

