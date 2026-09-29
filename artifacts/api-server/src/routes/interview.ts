import { Router, type IRouter } from "express";
import {
  SubmitInterviewTurnBody,
  SubmitInterviewTurnResponse,
} from "@workspace/api-zod";
import {
  generateInterviewTurnWithGemini,
  GeminiConfigurationError,
} from "../services/gemini.js";

const router: IRouter = Router();
const temporaryGeminiStatusCodes = new Set([429, 500, 502, 503, 504]);
const temporaryGeminiNetworkCodes = new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "ECONNREFUSED",
  "ENETUNREACH",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_SOCKET",
]);

function parseInterviewResponse(rawResponse: string) {
  const trimmed = rawResponse
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return SubmitInterviewTurnResponse.parse(JSON.parse(trimmed));
  } catch {
    const objectStart = trimmed.indexOf("{");
    const objectEnd = trimmed.lastIndexOf("}");
    if (objectStart < 0 || objectEnd <= objectStart) {
      throw new Error("Gemini did not return valid interview JSON.");
    }
    return SubmitInterviewTurnResponse.parse(
      JSON.parse(trimmed.slice(objectStart, objectEnd + 1)),
    );
  }
}

function getSafeUpstreamMessage(error: unknown, input: unknown) {
  if (!(error instanceof Error) || !error.message) return undefined;
  const valuesToRedact = [
    process.env.GEMINI_API_KEY,
    JSON.stringify(input),
  ].filter((value): value is string => Boolean(value));
  return valuesToRedact
    .reduce((message, value) => message.replaceAll(value, "[redacted]"), error.message)
    .slice(0, 500);
}

router.post("/interview/turn", async (req, res): Promise<void> => {
  const parsed = SubmitInterviewTurnBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn(
      {
        issues: parsed.error.issues.map(({ code, path }) => ({ code, path })),
      },
      "Invalid interview turn request",
    );
    res.status(400).json({ error: "Interview answer information is invalid." });
    return;
  }

  const input = {
    ...parsed.data,
    targetRole: parsed.data.targetRole.trim(),
    currentQuestion: parsed.data.currentQuestion.trim(),
    answer: parsed.data.answer.trim(),
    jobDescription: parsed.data.jobDescription.trim(),
    profile: Object.fromEntries(
      Object.entries(parsed.data.profile).map(([key, value]) => [
        key,
        value.trim(),
      ]),
    ),
    history: parsed.data.history.map((turn) => ({
      question: turn.question.trim(),
      answer: turn.answer.trim(),
    })),
  };

  if (!input.targetRole || !input.currentQuestion || !input.answer) {
    res.status(400).json({ error: "Please provide an answer before submitting." });
    return;
  }

  try {
    const rawResponse = await generateInterviewTurnWithGemini(input);
    res.status(200).json(parseInterviewResponse(rawResponse));
  } catch (error) {
    if (error instanceof GeminiConfigurationError) {
      req.log.warn("Gemini API is not configured");
      res.status(503).json({ error: "Gemini is not configured." });
      return;
    }

    const upstreamError =
      typeof error === "object" && error !== null
        ? (error as { status?: unknown; code?: unknown })
        : {};
    req.log.error(
      {
        errorType: error instanceof Error ? error.name : "UnknownError",
        upstreamStatus:
          typeof upstreamError.status === "number"
            ? upstreamError.status
            : undefined,
        upstreamCode:
          typeof upstreamError.code === "string"
            ? upstreamError.code
            : undefined,
        upstreamMessage: getSafeUpstreamMessage(error, input),
      },
      "Interview turn failed",
    );

    if (
      (typeof upstreamError.status === "number" &&
        temporaryGeminiStatusCodes.has(upstreamError.status)) ||
      (typeof upstreamError.code === "string" &&
        temporaryGeminiNetworkCodes.has(upstreamError.code))
    ) {
      res.status(503).json({
        error: "Gemini is temporarily unavailable. Please try again.",
      });
      return;
    }

    res.status(502).json({
      error: "Interview analysis failed. Please try again.",
    });
  }
});

export default router;