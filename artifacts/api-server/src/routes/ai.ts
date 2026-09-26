import { Router, type IRouter } from "express";
import { TestGeminiAiBody, TestGeminiAiResponse } from "@workspace/api-zod";
import {
  analyzeWithGemini,
  GeminiConfigurationError,
} from "../services/gemini.js";

const router: IRouter = Router();

router.post("/ai/test", async (req, res): Promise<void> => {
  const parsed = TestGeminiAiBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn(
      {
        issues: parsed.error.issues.map(({ code, path }) => ({ code, path })),
      },
      "Invalid Gemini test request",
    );
    res.status(400).json({
      error: "message must be a non-empty string of up to 4000 characters.",
    });
    return;
  }

  const message = parsed.data.message.trim();
  if (!message) {
    res.status(400).json({
      error: "message must be a non-empty string of up to 4000 characters.",
    });
    return;
  }

  try {
    const response = await analyzeWithGemini(message);
    res.status(200).json(
      TestGeminiAiResponse.parse({
        success: true,
        response,
      }),
    );
  } catch (error) {
    if (error instanceof GeminiConfigurationError) {
      req.log.warn("Gemini API is not configured");
      res.status(503).json({ error: "Gemini is not configured." });
      return;
    }

    const upstreamError =
      typeof error === "object" && error !== null
        ? (error as { status?: unknown; code?: unknown; message?: unknown })
        : {};
    let safeUpstreamMessage =
      typeof upstreamError.message === "string"
        ? upstreamError.message
        : undefined;
    if (safeUpstreamMessage && message) {
      safeUpstreamMessage = safeUpstreamMessage.replaceAll(message, "[prompt]");
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (safeUpstreamMessage && apiKey) {
      safeUpstreamMessage = safeUpstreamMessage.replaceAll(apiKey, "[redacted]");
    }
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
        upstreamMessage: safeUpstreamMessage?.slice(0, 300),
      },
      "Gemini request failed",
    );
    if (upstreamError.status === 429 || upstreamError.status === 503) {
      res.status(upstreamError.status).json({
        error: "Gemini is temporarily unavailable. Please try again.",
      });
      return;
    }

    res.status(502).json({
      error: "Gemini request failed. Please try again.",
    });
  }
});

export default router;