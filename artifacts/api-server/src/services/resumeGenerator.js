const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LEFT_MARGIN = 54;
const RIGHT_MARGIN = 54;
const TOP_MARGIN = 48;
const BOTTOM_MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN;

const SECTION_ORDER = [
  ["Summary", "summary"],
  ["Education", "education"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Certifications", "certifications"],
  ["Achievements", "achievements"],
];

function cleanText(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2022/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/[^\x09\x0a\x20-\x7e]/g, "")
    .trim();
}

function escapePdfText(value) {
  return cleanText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(value, fontSize, width = CONTENT_WIDTH) {
  const text = cleanText(value);
  if (!text) return [];

  const charactersPerLine = Math.max(
    24,
    Math.floor(width / Math.max(fontSize * 0.5, 1)),
  );
  const lines = [];

  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }

    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > charactersPerLine && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
  }

  return lines;
}

function buildLayout(input, scale) {
  const profile = input.profile;
  const resume = input.resume;
  const bodySize = 9.2 * scale;
  const bodyLeading = 12 * scale;
  const sectionSize = 8.6 * scale;
  const commands = [];
  let cursor = TOP_MARGIN;

  const text = (value, x, top, font, size) => {
    commands.push(
      `BT /${font} ${size.toFixed(2)} Tf 1 0 0 1 ${x.toFixed(2)} ${(PAGE_HEIGHT - top - size).toFixed(2)} Tm (${escapePdfText(value)}) Tj ET`,
    );
  };

  const rule = (top) => {
    commands.push(
      `0.65 w 0 0 0 RG ${LEFT_MARGIN} ${(PAGE_HEIGHT - top).toFixed(2)} m ${(PAGE_WIDTH - RIGHT_MARGIN).toFixed(2)} ${(PAGE_HEIGHT - top).toFixed(2)} l S`,
    );
  };

  text(profile.fullName, LEFT_MARGIN, cursor, "F2", 24 * scale);
  cursor += 29 * scale;

  const contact = [
    profile.email,
    profile.phone,
    profile.location,
  ]
    .map(cleanText)
    .filter(Boolean)
    .join(" | ");
  if (contact) {
    text(contact, LEFT_MARGIN, cursor, "F1", 9 * scale);
    cursor += 14 * scale;
  }

  const targetRole = cleanText(profile.targetRole);
  if (targetRole) {
    text(targetRole, LEFT_MARGIN, cursor, "F1", 9.5 * scale);
    cursor += 15 * scale;
  }

  rule(cursor + 2);
  cursor += 18 * scale;

  const section = (title) => {
    if (cursor > PAGE_HEIGHT - BOTTOM_MARGIN) return false;
    text(title.toUpperCase(), LEFT_MARGIN, cursor, "F2", sectionSize);
    cursor += 11 * scale;
    rule(cursor);
    cursor += 8 * scale;
    return true;
  };

  const paragraph = (value) => {
    const lines = wrapText(value, bodySize);
    for (const line of lines) {
      text(line, LEFT_MARGIN, cursor, "F1", bodySize);
      cursor += bodyLeading;
    }
    cursor += 2 * scale;
  };

  const bullets = (items) => {
    for (const item of items) {
      const lines = wrapText(item, bodySize, CONTENT_WIDTH - 14 * scale);
      if (!lines.length) continue;
      text("-", LEFT_MARGIN, cursor, "F2", bodySize);
      text(lines[0], LEFT_MARGIN + 12 * scale, cursor, "F1", bodySize);
      cursor += bodyLeading;
      for (const line of lines.slice(1)) {
        text(line, LEFT_MARGIN + 12 * scale, cursor, "F1", bodySize);
        cursor += bodyLeading;
      }
      cursor += 1.5 * scale;
    }
  };

  for (const [title, key] of SECTION_ORDER) {
    const value = resume[key];
    const items = Array.isArray(value)
      ? value.map(cleanText).filter(Boolean)
      : [];
    const hasContent =
      key === "summary"
        ? Boolean(cleanText(value))
        : items.length > 0;
    if (!hasContent) continue;

    section(title);
    if (key === "summary") {
      paragraph(value);
    } else {
      bullets(items);
    }
    cursor += 4 * scale;
  }

  return { commands, cursor };
}

function createPdfBuffer(stream) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${Buffer.byteLength(stream, "ascii")} >>\nstream\n${stream}\nendstream`,
  ];
  const chunks = [Buffer.from("%PDF-1.4\n%\xff\xff\xff\xff\n", "binary")];
  const offsets = [0];

  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.concat(chunks).length);
    chunks.push(Buffer.from(`${index + 1} 0 obj\n${objects[index]}\nendobj\n`, "ascii"));
  }

  const bodyLength = Buffer.concat(chunks).length;
  const xref = [
    `xref\n0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
  ].join("\n");
  chunks.push(
    Buffer.from(
      `${xref}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${bodyLength}\n%%EOF\n`,
      "ascii",
    ),
  );

  return Buffer.concat(chunks);
}

/**
 * @param {{ profile: Record<string, string>, resume: Record<string, unknown> }} input
 * @returns {Buffer}
 */
export function generateResumePdf(input) {
  let scale = 1;
  let layout = buildLayout(input, scale);

  while (layout.cursor > PAGE_HEIGHT - BOTTOM_MARGIN && scale > 0.62) {
    scale -= 0.04;
    layout = buildLayout(input, scale);
  }

  if (layout.cursor > PAGE_HEIGHT - BOTTOM_MARGIN) {
    throw new Error("Resume content does not fit on one page.");
  }

  return createPdfBuffer(layout.commands.join("\n"));
}