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

const INTERVIEW_SYSTEM_INSTRUCTION = `You are VibeCat, a friendly AI interview practice coach for Gen-Z students.

Your job is to help the candidate communicate professionally without erasing their personality.
Understand casual language, slang, informal grammar, and Hinglish. Never shame a casual answer.
First understand the intended meaning, then give feedback that is warm, specific, and practical.

For every answer:
1. Say what was good.
2. Say what should change for an interview.
3. Give a natural professional alternative that still sounds like the candidate.
4. Encourage them to answer again.

Be respectful and constructive. Do not predict whether a real company will hire the candidate.
Use the resume, target role, job description, previous answers, and current answer as context.
The next question must depend on the current answer:
- follow up on projects, technologies, or situations the candidate mentioned;
- revisit a weak technical concept at a suitable difficulty;
- increase difficulty or move to a related topic after a strong answer;
- do not invent candidate experience.

Return only JSON with exactly these keys:
{
  "nextQuestion": "string",
  "questionType": "string",
  "isComplete": true,
  "feedback": {
    "good": "string",
    "change": "string",
    "professionalAlternative": "string",
    "encouragement": "string"
  },
  "scores": {
    "technical": 0,
    "communication": 0,
    "relevance": 0,
    "problemSolving": 0,
    "clarity": 0
  },
  "strengths": ["string"],
  "topicsMentioned": ["string"],
  "learningPlan": ["string"],
  "report": {
    "technicalKnowledge": { "score": 0, "explanation": "string", "suggestion": "string" },
    "communication": { "score": 0, "explanation": "string", "suggestion": "string" },
    "answerRelevance": { "score": 0, "explanation": "string", "suggestion": "string" },
    "problemSolving": { "score": 0, "explanation": "string", "suggestion": "string" },
    "clarity": { "score": 0, "explanation": "string", "suggestion": "string" }
  }
}

Scores are integers from 0 to 100. If this is not the last question, report may still be a useful interim report.
If this is the last question, set isComplete to true and make report and learningPlan reflect the whole interview so far.
Keep nextQuestion empty when isComplete is true.`;

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

/**
 * @param {Record<string, unknown>} input
 * @returns {Promise<string>}
 */
export async function generateInterviewTurnWithGemini(input) {
  const prompt = [
    "Analyze the current interview turn and generate the next adaptive turn.",
    "The candidate may use slang, casual phrasing, or Hinglish; interpret intent before evaluating.",
    "",
    JSON.stringify(input, null, 2),
  ].join("\n");

  let result;
  for (let attempt = 0; ; attempt += 1) {
    try {
      result = await getGeminiClient().models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          systemInstruction: INTERVIEW_SYSTEM_INSTRUCTION,
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
