import { test, expect, type Page, Locator } from "@playwright/test";
import { describe } from "node:test";
import mockResponse from "../src/mock-response.json" with { type: "json" };

let settingsButton: Locator;
let settingsCloseButton: Locator;
let submitButton: Locator;

const apiRoute = "*/**/v1/chat/completions";

const inputFields = [
  {
    element: "input",
    name: "salutation",
    value: "Dear Hiring Manager,",
    required: true,
  },
  {
    element: "textarea",
    name: "jobDescription",
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    required: true,
  },
  {
    element: "textarea",
    name: "additionalNotes",
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    required: false,
  },

  {
    element: "input",
    name: "temperature",
    value: "0.7",
    required: true,
    hasDefaultValue: true,
  },
  {
    element: "input",
    name: "wordLimit",
    value: "300",
    required: true,
    hasDefaultValue: true,
  },
  {
    element: "input",
    page: "settings",
    name: "apiKey",
    value: "abc123",
    required: true,
  },
  {
    element: "input",
    page: "settings",
    name: "name",
    value: "John Doe",
    required: true,
  },
  {
    element: "textarea",
    page: "settings",
    name: "workExperience",
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    required: true,
  },
];

// Filter out the required input fields that have a default value and are not emptyable
const requiredInputFields = inputFields.filter(
  ({ required, hasDefaultValue }) => required && !hasDefaultValue,
);

const mainFormFields = requiredInputFields.filter(({ page }) => !page);
const settingsFields = requiredInputFields.filter(
  ({ page }) => page === "settings",
);

describe("Main", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");

    settingsButton = page.getByRole("button").first();
    settingsCloseButton = page.getByRole("button").nth(2);
    submitButton = page.getByRole("button", { name: "Generate" });
  });

  async function fillOutForm(page: Page, clearFields = false) {
    // Click the settings button to open the settings form
    settingsButton?.click();
    await page.waitForTimeout(500);

    // Set values for the settings form
    for (const { element, name, value } of settingsFields) {
      await page.fill(`${element}[name='${name}']`, clearFields ? "" : value);
    }

    // Close the settings form
    settingsCloseButton.click();
    await page.waitForTimeout(500);

    // Set values for the input fields and textareas
    for (const { element, name, value } of mainFormFields) {
      await page.fill(`${element}[name='${name}']`, clearFields ? "" : value);
    }
  }

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle("Vite + React + TS");
  });

  test("should not be submittable when required fields are empty", async ({
    page,
  }) => {
    await fillOutForm(page, true);

    const isDisabled = await submitButton?.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test("should be submittable when required fields are filled", async ({
    page,
  }) => {
    await fillOutForm(page);

    const isDisabled = await submitButton?.isDisabled();
    expect(isDisabled).toBe(false);
  });

  test("should generate a cover letter", async ({ page }) => {
    await page.route(apiRoute, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockResponse.chatCompletion),
      });
    });

    // Set up response listener
    const responsePromise = page.waitForResponse(apiRoute);

    await fillOutForm(page);

    submitButton?.click();

    await responsePromise;

    await page.waitForTimeout(500);

    expect(responsePromise).not.toBeNull();
    expect(page.getByText("Dear Mock,")).toBeInViewport();
  });
});
