#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { chromium, Browser, BrowserContext, Page } from "playwright";

const server = new Server(
  {
    name: "playwright-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

let browser: Browser;
let context: BrowserContext;
let page: Page;

async function initBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: false,
    });
    context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    page = await context.newPage();
  }
}

async function runPrompt(prompt: string, baseUrl: string = "") {
  await initBrowser();

  const lines = prompt
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const results: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.toLowerCase();

    if (line.startsWith("go to ") || line.startsWith("visit ") || line.startsWith("open ")) {
      const url = rawLine.replace(/^go to\s+/i, "").replace(/^visit\s+/i, "").replace(/^open\s+/i, "");
      const nextUrl = /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`;
      await page.goto(nextUrl, { waitUntil: "domcontentloaded" });
      results.push(`Navigated to ${nextUrl}`);
      continue;
    }

    if (line.startsWith("click ")) {
      const selector = rawLine.replace(/^click\s+/i, "");
      await page.getByRole("button", { name: new RegExp(selector, "i") }).click().catch(() => page.getByText(selector, { exact: false }).click());
      results.push(`Clicked ${selector}`);
      continue;
    }

    if (line.startsWith("type ")) {
      const m = rawLine.match(/^type\s+(.+?)\s+(.+)$/i);
      if (!m) {
        throw new Error("Type command must be in the format: type <selector-or-label> <value>");
      }
      const [, target, value] = m;
      await page.getByLabel(target, { exact: false }).fill(value).catch(() => page.locator(target).fill(value));
      results.push(`Typed "${value}" into ${target}`);
      continue;
    }

    if (line.startsWith("fill ")) {
      const m = rawLine.match(/^fill\s+(.+?)\s+(.+)$/i);
      if (!m) {
        throw new Error("Fill command must be in the format: fill <selector-or-label> <value>");
      }
      const [, target, value] = m;
      await page.getByLabel(target, { exact: false }).fill(value).catch(() => page.locator(target).fill(value));
      results.push(`Filled "${value}" into ${target}`);
      continue;
    }

    if (line.startsWith("submit")) {
      await page.locator('button[type="submit"], input[type="submit"]').click().catch(() => page.keyboard.press("Enter"));
      results.push("Submitted the form");
      continue;
    }

    if (line.startsWith("wait ")) {
      const seconds = Number.parseFloat(rawLine.replace(/^wait\s+/i, ""));
      await page.waitForTimeout(seconds * 1000);
      results.push(`Waited ${seconds} seconds`);
      continue;
    }

    if (line.startsWith("read ")) {
      const text = await page.locator("body").textContent();
      results.push(`Read page text: ${text?.slice(0, 300)}`);
      continue;
    }

    if (line.startsWith("screenshot")) {
      const screenshotPath = "playwright-mcp.png";
      await page.screenshot({ path: screenshotPath, fullPage: true });
      results.push(`Saved screenshot to ${screenshotPath}`);
      continue;
    }

    if (line.startsWith("press ")) {
      const key = rawLine.replace(/^press\s+/i, "");
      await page.keyboard.press(key);
      results.push(`Pressed ${key}`);
      continue;
    }

    if (line.startsWith("select ")) {
      const m = rawLine.match(/^select\s+(.+?)\s+(.+)$/i);
      if (!m) {
        throw new Error("Select command must be in the format: select <label> <option>");
      }
      const [, target, option] = m;
      await page.getByLabel(target, { exact: false }).selectOption({ label: option }).catch(() => page.locator(target).selectOption({ label: option }));
      results.push(`Selected ${option} in ${target}`);
      continue;
    }

    results.push(`Skipped unrecognized instruction: ${rawLine}`);
  }

  return {
    ok: true,
    steps: results,
    currentUrl: page.url(),
  };
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "playwright_prompt",
      description: "Run a Playwright browser flow from a prompt-like set of instructions.",
      inputSchema: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "Instructions such as 'go to /login', 'type username admin', 'click Sign in'.",
          },
          baseUrl: {
            type: "string",
            description: "Optional base URL to resolve relative paths.",
          },
        },
        required: ["prompt"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name !== "playwright_prompt") {
    throw new Error(`Unknown tool: ${name}`);
  }

  const { prompt, baseUrl = "" } = (args as { prompt: string; baseUrl?: string }) || {};
  const result = await runPrompt(prompt, baseUrl);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Playwright MCP server ready");
}

main().catch((error) => {
  console.error("Fatal error in MCP server:", error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  if (browser) await browser.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  if (browser) await browser.close();
  process.exit(0);
});