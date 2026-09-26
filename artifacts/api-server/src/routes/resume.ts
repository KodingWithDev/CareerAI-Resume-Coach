import { Router, type IRouter } from "express";
import {
  GenerateResumeBody,
  GenerateResumeResponse,
} from "@workspace/api-zod";
import {
  generateResumeWithGemini,
  GeminiConfigurationError,
} from "../services/gemini.js";

const router: IRouter = Router();

const invalidResumeMessage =
  "Please provide your name and target role before generating a resume.";

function parseGeneratedResume(rawResponse: string) {
  const trimmed = rawResponse.trim();
  const withoutCodeFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return GenerateResumeResponse.parse(JSON.parse(withoutCodeFence));
  } catch {
    const objectStart = withoutCodeFence.indexOf("{");
    const objectEnd = withoutCodeFence.lastIndexOf("}");

    if (objectStart < 0 || objectEnd <= objectStart) {
      throw new Error("Gemini did not return valid resume JSON.");
    }

    return GenerateResumeResponse.parse(
      JSON.parse(withoutCodeFence.slice(objectStart, objectEnd + 1)),
    );
  }
}

router.post("/resume/generate", async (req, res): Promise<void> => {
  const parsed = GenerateResumeBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn(
      {
        issues: parsed.error.issues.map(({ code, path }) => ({ code, path })),
      },
      "Invalid resume generation request",
    );
    res.status(400).json({ error: "Resume information is invalid." });
    return;
  }

  const profile = Object.fromEntries(
    Object.entries(parsed.data).map(([key, value]) => [key, value.trim()]),
  ) as typeof parsed.data;

  if (!profile.fullName || !profile.targetRole) {
    res.status(400).json({ error: invalidResumeMessage });
    return;
  }

  try {
    const rawResponse = await generateResumeWithGemini(profile);
    res.status(200).json(parseGeneratedResume(rawResponse));
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
      },
      "Resume generation failed",
    );

    if (upstreamError.status === 429 || upstreamError.status === 503) {
      res.status(upstreamError.status).json({
        error: "Gemini is temporarily unavailable. Please try again.",
      });
      return;
    }

    res.status(502).json({
      error: "Resume generation failed. Please try again.",
    });
  }
});

export default router;