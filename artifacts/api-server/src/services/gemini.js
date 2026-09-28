import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.8-flash";
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const RETRYABLE_NETWORK_CODES = new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "ECONNREFUSED",
  "ENETUNREACH",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_SOCKET",
]);
const MAX_RETRIES = 3;
const RESUME_SYSTEM_INSTRUCTION = `You are an expert professional resume writer.

Create an ATS-friendly resume using ONLY the information provided by the user.

Do not invent:
- experience
- education
- skills
- achievements
- companies
- certifications
- numerical results

Improve wording and structure but preserve factual accuracy.

Return structured JSON containing exactly these keys:
{
  "summary": "",
  "education": [],
  "skills": [],
  "projects": [],
  "experience": [],
  "certifications": [],
  "achievements": []
}

Every array item must be a concise string. Use an empty array when the user did not provide information for a section.`;

/** @type {GoogleGenAI | undefined} */
let client;
/** @type {string | undefined} */
let configuredApiKey;

export class GeminiConfigurationError extends Error {
  constructor() {
    super("GEMINI_API_KEY is not configured.");
    this.name = "GeminiConfigurationError";
  }
}

export class GeminiServiceError extends Error {
  constructor() {
    super("Gemini returned an empty response.");
    this.name = "GeminiServiceError";
  }
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new GeminiConfigurationError();
  }

  if (!client || configuredApiKey !== apiKey) {
    client = new GoogleGenAI({ apiKey });
    configuredApiKey = apiKey;
  }

  return client;
}

function getStatusCode(error) {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return undefined;
  }

  return typeof error.status === "number" ? error.status : undefined;
}

function getErrorCode(error) {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return undefined;
  }

  return typeof error.code === "string" ? error.code : undefined;
}

function isRetryableError(error) {
  const status = getStatusCode(error);
  return (
    (status !== undefined && RETRYABLE_STATUS_CODES.has(status)) ||
    RETRYABLE_NETWORK_CODES.has(getErrorCode(error))
  );
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function analyzeWithGemini(prompt) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new TypeError("A non-empty prompt is required.");
  }

  let result;
  for (let attempt = 0; ; attempt += 1) {
    try {
      result = await getGeminiClient().models.generateContent({
        model: MODEL,
        contents: prompt.trim(),
      });
      break;
    } catch (error) {
      if (attempt >= MAX_RETRIES || !isRetryableError(error)) {
        throw error;
      }
      await delay(2000 * 2 ** attempt);
    }
  }

  const response = result.text?.trim();

  if (!response) {
    throw new GeminiServiceError();
  }

  return response;
}

/**
 * @param {Record<string, string>} profile
 * @returns {Promise<string>}
 */
export async function generateResumeWithGemini(profile) {
  const prompt = [
    "Turn the following user-provided resume information into the requested structured JSON.",
    "The target role may guide emphasis and wording, but it is not permission to add facts.",
    "",
    JSON.stringify(profile, null, 2),
  ].join("\n");

  let result;
  for (let attempt = 0; ; attempt += 1) {
    try {
      result = await getGeminiClient().models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          systemInstruction: RESUME_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });
      break;
    } catch (error) {
      if (attempt >= MAX_RETRIES || !isRetryableError(error)) {
        throw error;
      }
      await delay(2000 * 2 ** attempt);
    }
  }

  const response = result.text?.trim();
  if (!response) {
    throw new GeminiServiceError();
  }

  return response;
}
